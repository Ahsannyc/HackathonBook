from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class EmbeddingProvider(ABC):
    """
    Abstract interface for generating text embeddings
    """

    @abstractmethod
    def embed_text(self, text: str) -> List[float]:
        """
        Generate embeddings for the given text
        :param text: Input text to embed
        :return: List of embedding values (floats)
        """
        pass


class GenerationProvider(ABC):
    """
    Abstract interface for generating text responses
    """

    @abstractmethod
    def generate_response(self, prompt: str, context: str = "", user_profile: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate a response based on the prompt and context
        :param prompt: User's query or prompt
        :param context: Relevant context to base the response on
        :param user_profile: Optional user profile for personalization
        :return: Generated response string
        """
        pass