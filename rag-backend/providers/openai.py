from typing import List, Dict, Any, Optional
import logging
from openai import OpenAI
from providers.base import EmbeddingProvider, GenerationProvider
from config import Config

logger = logging.getLogger(__name__)


class OpenAIEmbeddingProvider(EmbeddingProvider):
    """
    OpenAI implementation of the EmbeddingProvider interface
    """

    def __init__(self):
        api_key = Config.OPENAI_API_KEY
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set in config")

        self.client = OpenAI(api_key=api_key)
        self.model = "text-embedding-ada-002"  # Using a reliable embedding model

    def embed_text(self, text: str) -> List[float]:
        """
        Generate embeddings for the given text using OpenAI
        :param text: Input text to embed
        :return: List of embedding values (floats)
        """
        try:
            response = self.client.embeddings.create(
                input=text,
                model=self.model
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating OpenAI embedding: {str(e)}")
            # Return a zero vector as fallback (size 1536 for text-embedding-ada-002)
            return [0.0] * 1536


class OpenAIGenerationProvider(GenerationProvider):
    """
    OpenAI implementation of the GenerationProvider interface
    """

    def __init__(self):
        api_key = Config.OPENAI_API_KEY
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set in config")

        self.client = OpenAI(api_key=api_key)
        self.model = Config.LLM_MODEL

    def generate_response(self, prompt: str, context: str = "", user_profile: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate a response based on the prompt and context using OpenAI
        :param prompt: User's query or prompt
        :param context: Relevant context to base the response on
        :param user_profile: Optional user profile for personalization
        :return: Generated response string
        """
        try:
            # Create the system message with context
            system_message = context if context else "You are a helpful assistant."

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.3
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.error(f"Error generating OpenAI response: {str(e)}")
            return "I don't know — it's not in the provided content."