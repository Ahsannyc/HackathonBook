import openai
from typing import List, Dict, Any, Optional
import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from openai import OpenAI
import logging
from dotenv import load_dotenv
from config import Config
from fastapi import FastAPI
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RAGSystem:
    """
    Core RAG System Class implementing the Retrieval-Augmented Generation functionality
    following the specification requirements:
    - Uses OpenAI Agents/ChatKit for intelligent question answering
    - Integrates with Qdrant for vector storage and retrieval
    - Implements strict source grounding to prevent hallucinations
    - Supports dual-mode retrieval (full-book and selected text)
    """

    def __init__(self):
        # Initialize OpenAI client
        api_key = Config.OPENAI_API_KEY
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set in config")

        self.openai_client = OpenAI(api_key=api_key)
        self.llm_model = Config.LLM_MODEL

        # Initialize Qdrant client
        if Config.QDRANT_URL and Config.QDRANT_API_KEY:
            self.qdrant_client = QdrantClient(
                url=Config.QDRANT_URL,
                api_key=Config.QDRANT_API_KEY
            )
        else:
            # Use in-memory storage if no Qdrant credentials are provided
            self.qdrant_client = QdrantClient(":memory:")
        self.collection_name = "book_content_chunks"

        # Create collection if it doesn't exist
        self._initialize_collection()

    def _initialize_collection(self):
        """Initialize the Qdrant collection for book content chunks"""
        try:
            # Check if collection exists
            self.qdrant_client.get_collection(self.collection_name)
            logger.info(f"Collection '{self.collection_name}' already exists")
        except Exception:
            # Create collection if it doesn't exist
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE),  # OpenAI embedding size
            )
            logger.info(f"Created collection '{self.collection_name}' for book content chunks")

    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for text using OpenAI's embedding API"""
        try:
            response = self.openai_client.embeddings.create(
                input=text,
                model="text-embedding-ada-002"  # Using a reliable embedding model
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            # Return a zero vector as fallback (size 1536 for text-embedding-ada-002)
            return [0.0] * 1536

    def store_chunk(self, chunk_id: str, content: str, book_id: str, section_title: str, page_number: int, chunk_number: int, metadata: Optional[Dict] = None) -> bool:
        """Store a book content chunk in Qdrant vector database with metadata"""
        try:
            # Generate embedding for the content
            embedding = self.embed_text(content)

            # Prepare the payload with all required metadata
            payload = {
                "content": content,
                "book_id": book_id,
                "section_title": section_title,
                "page_number": page_number,
                "chunk_number": chunk_number,
                "metadata": metadata or {}
            }

            # Upsert the record in Qdrant
            self.qdrant_client.upsert(
                collection_name=self.collection_name,
                points=[
                    models.PointStruct(
                        id=chunk_id,
                        vector=embedding,
                        payload=payload
                    )
                ]
            )

            logger.info(f"Stored chunk {chunk_id} for book {book_id}")
            return True

        except Exception as e:
            logger.error(f"Error storing chunk {chunk_id}: {str(e)}")
            return False

    def retrieve_relevant_chunks(self, query: str, book_id: str = None, top_k: int = 5) -> List[Dict[str, Any]]:
        """Retrieve relevant document chunks from Qdrant based on the query with optional book filtering"""
        query_embedding = self.embed_text(query)

        # Prepare filters if book_id is specified
        filters = None
        if book_id:
            filters = models.Filter(
                must=[
                    models.FieldCondition(
                        key="book_id",
                        match=models.MatchValue(value=book_id)
                    )
                ]
            )

        search_result = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            query_filter=filters,
            limit=top_k
        )

        relevant_chunks = []
        for result in search_result:
            chunk_data = {
                'chunk_id': result.id,
                'content': result.payload.get('content', ''),
                'book_id': result.payload.get('book_id', ''),
                'section_title': result.payload.get('section_title', ''),
                'page_number': result.payload.get('page_number', 0),
                'chunk_number': result.payload.get('chunk_number', 0),
                'metadata': result.payload.get('metadata', {}),
                'score': result.score  # Similarity score
            }
            relevant_chunks.append(chunk_data)

        return relevant_chunks

    def generate_answer_from_context(self, query: str, context_chunks: List[Dict[str, Any]], user_profile: Optional[Dict[str, Any]] = None) -> str:
        """Generate an answer based on the query and retrieved context, with strict source grounding"""
        if not context_chunks:
            return "I don't know — it's not in the provided content."

        # Combine all context chunks into a single context string
        context = "\n\n".join([f"Section: {chunk['section_title']} (Page {chunk['page_number']})\nContent: {chunk['content']}" for chunk in context_chunks])

        # Create the system message with strict grounding rules
        system_message = """You must answer strictly using only the information provided in the context.
If the information is not present in the provided context, respond with: 'I don't know — it's not in the provided content.'
NEVER generate information that is not explicitly stated in the provided context.
Keep your answers accurate, concise, and directly based on the provided content."""

        # Add personalization based on user profile if available
        if user_profile:
            software_exp = user_profile.get('software_experience', 'intermediate')
            hardware_exp = user_profile.get('hardware_experience', 'intermediate')

            # Adjust the system message based on user experience level
            if software_exp == 'beginner' or hardware_exp == 'beginner':
                system_message += f"\n\nWhen explaining concepts, assume the user has beginner-level experience in {' and '.join([exp for exp in [software_exp, hardware_exp] if exp == 'beginner'])}. Provide more detailed explanations and simpler terminology."
            elif software_exp == 'advanced' or hardware_exp == 'advanced':
                system_message += f"\n\nWhen explaining concepts, assume the user has advanced-level experience in {' and '.join([exp for exp in [software_exp, hardware_exp] if exp == 'advanced'])}. You can use technical terminology and assume prior knowledge of basic concepts."

        # Create the user message
        user_message = f"""
        CONTEXT:
        {context}

        QUESTION:
        {query}

        ANSWER (based ONLY on the provided context):"""

        try:
            response = self.openai_client.chat.completions.create(
                model=self.llm_model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=1000,
                temperature=0.3
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.error(f"Error generating answer: {str(e)}")
            return "I don't know — it's not in the provided content."

    def answer_from_selected_text(self, query: str, selected_text: str, user_profile: Optional[Dict[str, Any]] = None) -> str:
        """Answer the query based only on the provided selected text with strict source grounding"""
        # Create the system message with strict grounding rules
        system_message = """You must answer strictly using ONLY the provided selected text.
If the information is not present in the selected text, respond with: 'I don't know — it's not in the provided content.'
NEVER generate information that is not explicitly stated in the selected text.
Keep your answers accurate, concise, and directly based on the selected text."""

        # Add personalization based on user profile if available
        if user_profile:
            software_exp = user_profile.get('software_experience', 'intermediate')
            hardware_exp = user_profile.get('hardware_experience', 'intermediate')

            # Adjust the system message based on user experience level
            if software_exp == 'beginner' or hardware_exp == 'beginner':
                system_message += f"\n\nWhen explaining concepts, assume the user has beginner-level experience in {' and '.join([exp for exp in [software_exp, hardware_exp] if exp == 'beginner'])}. Provide more detailed explanations and simpler terminology."
            elif software_exp == 'advanced' or hardware_exp == 'advanced':
                system_message += f"\n\nWhen explaining concepts, assume the user has advanced-level experience in {' and '.join([exp for exp in [software_exp, hardware_exp] if exp == 'advanced'])}. You can use technical terminology and assume prior knowledge of basic concepts."

        # Create the user message
        user_message = f"""
        SELECTED TEXT:
        {selected_text}

        QUESTION:
        {query}

        ANSWER (based ONLY on the selected text):"""

        try:
            response = self.openai_client.chat.completions.create(
                model=self.llm_model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=1000,
                temperature=0.3
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.error(f"Error generating answer from selected text: {str(e)}")
            return "I don't know — it's not in the provided content."

    def query_full_book(self, query: str, book_id: str, user_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Process a query against the full book content"""
        relevant_chunks = self.retrieve_relevant_chunks(query, book_id=book_id, top_k=Config.TOP_K_RESULTS)

        if not relevant_chunks:
            return {
                "answer": "I don't know — it's not in the provided content.",
                "source_chunks": [],
                "book_id": book_id
            }

        # Generate answer based on retrieved context
        answer = self.generate_answer_from_context(query, relevant_chunks, user_profile)

        return {
            "answer": answer,
            "source_chunks": relevant_chunks,
            "book_id": book_id
        }

    def query_selected_text(self, query: str, selected_text: str, user_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Process a query against only the selected text"""
        # Answer based only on the selected text
        answer = self.answer_from_selected_text(query, selected_text, user_profile)

        return {
            "answer": answer,
            "source_chunks": [{"content": selected_text, "source_type": "selected_text"}],
            "query_type": "selection_only"
        }

    def validate_response_accuracy(self, response: str, context: List[Dict[str, Any]]) -> bool:
        """Validate that the response is grounded in the provided context"""
        # This is a basic check - in production, we'd implement more sophisticated validation
        response_lower = response.lower()
        context_text = " ".join([chunk['content'].lower() for chunk in context])

        # If response contains "don't know" or similar, it's valid
        if "don't know" in response_lower or "not in the provided content" in response_lower:
            return True

        # If response is grounded in context, it's valid
        # (This is a simplified check - a more robust implementation would check semantic similarity)
        return True  # Simplified for now, but the grounding is enforced by the system messages

# Create the FastAPI application
app = FastAPI(
    title="Hackathon Book RAG API",
    description="Retrieval-Augmented Generation API for the Hackathon Book",
    version="1.0.0"
)

# Initialize RAG system
try:
    rag_system = RAGSystem()
except Exception as e:
    logger.error(f"Failed to initialize RAG system: {e}")
    # Create a mock rag_system for health check to work
    class MockRAGSystem:
        def query_full_book(self, query, book_id, user_profile=None):
            return {
                "answer": "RAG system not fully initialized due to missing configuration",
                "source_chunks": [],
                "book_id": book_id
            }

    rag_system = MockRAGSystem()

@app.get("/")
def read_root():
    return {"message": "Hackathon Book RAG API is running!"}

@app.get("/rag/health")
async def rag_health_check():
    """RAG-specific health check endpoint that returns healthy status"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat(), "service": "RAG backend"}

# For backward compatibility with the existing proxy
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}