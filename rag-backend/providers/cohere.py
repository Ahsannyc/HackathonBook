from typing import List, Dict, Any, Optional
import logging
from providers.base import EmbeddingProvider, GenerationProvider
from config import Config
import cohere

logger = logging.getLogger(__name__)


class CohereEmbeddingProvider(EmbeddingProvider):
    """
    Cohere implementation of the EmbeddingProvider interface
    """

    def __init__(self):
        api_key = Config.COHERE_API_KEY
        if not api_key:
            raise ValueError("COHERE_API_KEY environment variable is not set in config")

        self.client = cohere.Client(api_key=api_key)
        self.model = getattr(Config, 'COHERE_EMBEDDING_MODEL', 'embed-multilingual-v3.0')

    def embed_text(self, text: str) -> List[float]:
        """
        Generate embeddings for the given text using Cohere
        :param text: Input text to embed
        :return: List of embedding values (floats)
        """
        try:
            response = self.client.embed(
                texts=[text],
                model=self.model,
                input_type="search_document"  # Using search_document for RAG context
            )
            return response.embeddings[0]  # Return the first (and only) embedding
        except Exception as e:
            logger.error(f"Error generating Cohere embedding: {str(e)}")
            # Return a zero vector as fallback
            # Cohere v3 models return 1024-dim embeddings
            return [0.0] * 1024


class CohereGenerationProvider(GenerationProvider):
    """
    Cohere implementation of the GenerationProvider interface
    """

    def __init__(self):
        api_key = Config.COHERE_API_KEY
        if not api_key:
            raise ValueError("COHERE_API_KEY environment variable is not set in config")

        self.client = cohere.Client(api_key=api_key)
        self.model = getattr(Config, 'COHERE_MODEL', 'command-r-plus')

    def generate_response(self, prompt: str, context: str = "", user_profile: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate a response based on the prompt and context using Cohere
        :param prompt: User's query or prompt
        :param context: Relevant context to base the response on
        :param user_profile: Optional user profile for personalization
        :return: Generated response string
        """
        try:
            # Combine context and prompt for Cohere
            message = context + "\n\n" + prompt if context else prompt

            # Prepare the system message if available
            system_message = context if context else None

            response = self.client.chat(
                message=message,
                model=self.model,
                temperature=0.3,
                max_tokens=1000
            )

            return response.text.strip()

        except Exception as e:
            logger.error(f"Error generating Cohere response: {str(e)}")
            return "I don't know — it's not in the provided content."