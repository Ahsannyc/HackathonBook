# Quickstart: Fix RAG System Imports and Add Cohere Support

## Setup

1. **Install Dependencies**:
   ```bash
   pip install cohere
   ```

2. **Update Environment Variables**:
   ```bash
   # Add Cohere API key to your .env file
   COHERE_API_KEY=your_cohere_api_key_here
   ```

3. **Configuration**:
   - Set `PROVIDER_TYPE=openai` to use OpenAI (default)
   - Set `PROVIDER_TYPE=cohere` to use Cohere
   - The system will automatically fall back to OpenAI if Cohere is not configured

## Usage

1. **Run the Service**:
   ```bash
   cd rag-backend
   python -m uvicorn main:app --reload
   ```

2. **API Endpoints**:
   - `POST /rag/query` - Query using configured provider
   - `POST /rag/selected_text_query` - Selected text query using configured provider
   - `POST /rag/ingest` - Ingest content with configured provider

## Testing

1. **Verify Provider Selection**:
   ```bash
   # Test with environment variable
   PROVIDER_TYPE=cohere python -c "from config import Config; print(Config.PROVIDER_TYPE)"
   ```

2. **Check Fallback Behavior**:
   - Start service without Cohere API key
   - Verify it falls back to OpenAI
   - Add Cohere API key and restart
   - Verify Cohere integration works