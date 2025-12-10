import openai
from typing import List, Dict, Any
import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from openai import OpenAI
import logging
from dotenv import load_dotenv
import dashscope
from dashscope import TextEmbedding, Generation

# Load environment variables from .env file
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Qdrant client
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

class RAGSystem:
    def __init__(self):
        self.qdrant_client = qdrant_client
        self.collection_name = "hackathon_book_docs"
        self.llm_model = os.getenv("LLM_MODEL", "qwen-max")

        # Initialize Qwen (DashScope)
        api_key = os.getenv("QWEN_API_KEY")
        if not api_key:
            raise ValueError("QWEN_API_KEY environment variable is not set")

        dashscope.api_key = api_key

    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for text using Qwen's embedding API"""
        try:
            response = TextEmbedding.call(
                model='text-embedding-v1',
                input=text
            )
            if response.status_code == 200:
                embedding = response.output['embeddings'][0]['embedding']
                return embedding
            else:
                logger.error(f"Error generating embedding: {response.code}, {response.message}")
                return [0.0] * 1024  # text-embedding-v1 returns 1024 dimensional vectors
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            # Return a zero vector as fallback
            return [0.0] * 1024  # text-embedding-v1 returns 1024 dimensional vectors

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
            response = Generation.call(
                model=self.llm_model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=1000,
                temperature=0.3
            )

            if response.status_code == 200:
                return response.output.text.strip()
            else:
                logger.error(f"Error generating answer: {response.code}, {response.message}")
                return "I don't know — it's not in the provided content."

        except Exception as e:
            logger.error(f"Error generating answer: {str(e)}")
            return "I don't know — it's not in the provided content."

    def answer_from_selected_text(self, query: str, selected_text: str, user_profile: Dict[str, Any] = None) -> str:
        """Answer the query based only on the provided selected text"""
        # Create the system message with grounding rules
        system_message = """You must answer strictly using the retrieved content or the selected text snippet.
        If information is not present, respond: 'I don't know — it's not in the provided content.'
        Never generate ungrounded information."""

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
        Selected Text: {selected_text}

        Question: {query}

        Answer: """

        try:
            response = Generation.call(
                model=self.llm_model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=1000,
                temperature=0.3
            )

            if response.status_code == 200:
                return response.output.text.strip()
            else:
                logger.error(f"Error generating answer from selected text: {response.code}, {response.message}")
                return "I don't know — it's not in the provided content."

        except Exception as e:
            logger.error(f"Error generating answer from selected text: {str(e)}")
            return "I don't know — it's not in the provided content."

    def query(self, query: str, user_profile: Dict[str, Any] = None) -> Dict[str, Any]:
        """Main query method that retrieves relevant chunks and generates an answer"""
        relevant_chunks = self.retrieve_relevant_chunks(query)

        if not relevant_chunks:
            return {
                "answer": "I don't know — it's not in the provided content.",
                "source_chunks": []
            }

        # Generate personalized answer based on user profile
        answer = self.generate_answer(query, relevant_chunks, user_profile)

        return {
            "answer": answer,
            "source_chunks": relevant_chunks
        }

    def generate_answer(self, query: str, context_chunks: List[Dict[str, Any]], user_profile: Dict[str, Any] = None) -> str:
        """Generate an answer based on the query and retrieved context, personalized for the user"""
        # Combine all context chunks into a single context string
        context = "\n\n".join([chunk['content'] for chunk in context_chunks])

        # Create the system message with grounding rules
        system_message = """You must answer strictly using the retrieved content or the selected text snippet.
If information is not present, respond: 'I don't know — it's not in the provided content.'
Never generate ungrounded information."""

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
        Context: {context}

        Question: {query}

        Answer: """

        try:
            response = Generation.call(
                model=self.llm_model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=1000,
                temperature=0.3
            )

            if response.status_code == 200:
                return response.output.text.strip()
            else:
                logger.error(f"Error generating answer: {response.code}, {response.message}")
                return "I don't know — it's not in the provided content."

        except Exception as e:
            logger.error(f"Error generating answer: {str(e)}")
            return "I don't know — it's not in the provided content."