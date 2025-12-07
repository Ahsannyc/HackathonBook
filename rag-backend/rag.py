import openai
from typing import List, Dict, Any
import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from sentence_transformers import SentenceTransformer
import tiktoken
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Qdrant client
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

# Initialize embedding model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')  # Using a lightweight model as alternative to text-embedding-3-small

class RAGSystem:
    def __init__(self):
        self.qdrant_client = qdrant_client
        self.embedding_model = embedding_model
        self.collection_name = "hackathon_book_docs"
        self.llm_model = os.getenv("LLM_MODEL", "gpt-4o-mini")

        # Initialize OpenAI
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for text using the embedding model"""
        embedding = self.embedding_model.encode([text])
        return embedding[0].tolist()

    def retrieve_relevant_chunks(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Retrieve relevant document chunks from Qdrant based on the query"""
        query_embedding = self.embed_text(query)

        search_result = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=top_k
        )

        relevant_chunks = []
        for result in search_result:
            chunk_data = {
                'content': result.payload.get('content', ''),
                'source': result.payload.get('source', ''),
                'metadata': result.payload.get('metadata', {})
            }
            relevant_chunks.append(chunk_data)

        return relevant_chunks

    def generate_answer(self, query: str, context_chunks: List[Dict[str, Any]]) -> str:
        """Generate an answer based on the query and retrieved context"""
        # Combine all context chunks into a single context string
        context = "\n\n".join([chunk['content'] for chunk in context_chunks])

        # Create the system message with grounding rules
        system_message = """You must answer strictly using the retrieved content or the selected text snippet.
        If information is not present, respond: 'I don't know — it's not in the provided content.'
        Never generate ungrounded information."""

        # Create the user message
        user_message = f"""
        Context: {context}

        Question: {query}

        Answer: """

        try:
            response = openai.chat.completions.create(
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

    def answer_from_selected_text(self, query: str, selected_text: str) -> str:
        """Answer the query based only on the provided selected text"""
        # Create the system message with grounding rules
        system_message = """You must answer strictly using the retrieved content or the selected text snippet.
        If information is not present, respond: 'I don't know — it's not in the provided content.'
        Never generate ungrounded information."""

        # Create the user message
        user_message = f"""
        Selected Text: {selected_text}

        Question: {query}

        Answer: """

        try:
            response = openai.chat.completions.create(
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

    def query(self, query: str) -> Dict[str, Any]:
        """Main query method that retrieves relevant chunks and generates an answer"""
        relevant_chunks = self.retrieve_relevant_chunks(query)

        if not relevant_chunks:
            return {
                "answer": "I don't know — it's not in the provided content.",
                "source_chunks": []
            }

        answer = self.generate_answer(query, relevant_chunks)

        return {
            "answer": answer,
            "source_chunks": relevant_chunks
        }