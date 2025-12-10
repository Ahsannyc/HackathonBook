import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))
print("QDRANT_URL:", os.getenv("QDRANT_URL"))
print("QDRANT_API_KEY:", os.getenv("QDRANT_API_KEY"))
print("DATABASE_URL:", os.getenv("DATABASE_URL"))
print("LLM_MODEL:", os.getenv("LLM_MODEL"))

# Check if API key exists
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    print("✅ OPENAI_API_KEY is loaded successfully")
    print("API Key length:", len(api_key))
    print("API Key starts with:", api_key[:10])
else:
    print("❌ OPENAI_API_KEY is not loaded")