import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    # OpenAI Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")

    # Cohere Configuration
    COHERE_API_KEY = os.getenv("COHERE_API_KEY")
    COHERE_MODEL = os.getenv("COHERE_MODEL", "command-r-plus")
    COHERE_EMBEDDING_MODEL = os.getenv("COHERE_EMBEDDING_MODEL", "embed-multilingual-v3.0")

    # Provider Configuration
    PROVIDER_TYPE = os.getenv("PROVIDER_TYPE", "openai").lower()  # openai or cohere

    # Qdrant Configuration
    QDRANT_URL = os.getenv("QDRANT_URL")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

    # Neon Database Configuration
    NEON_DATABASE_URL = os.getenv("NEON_DATABASE_URL")

    # Fallback to local SQLite if Neon is not configured
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./rag_chatbot.db")

    # Application Configuration
    BACKEND_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
    BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))

    # Chunking Configuration
    CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
    OVERLAP_SIZE = int(os.getenv("OVERLAP_SIZE", "200"))

    # RAG Configuration
    TOP_K_RESULTS = int(os.getenv("TOP_K_RESULTS", "5"))
    SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.7"))

    # Session Configuration
    SESSION_EXPIRY_HOURS = int(os.getenv("SESSION_EXPIRY_HOURS", "24"))

    @classmethod
    def validate_config(cls):
        """Validate that required configuration values are present"""
        # Check if using Cohere and validate accordingly
        provider_type = getattr(cls, 'PROVIDER_TYPE', 'openai').lower()

        if provider_type == 'cohere' and cls.COHERE_API_KEY:
            required_vars = ["COHERE_API_KEY"]
        else:
            # Default to OpenAI validation
            required_vars = ["OPENAI_API_KEY"]

        missing_vars = []

        for var in required_vars:
            if not getattr(cls, var):
                missing_vars.append(var)

        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

        return True