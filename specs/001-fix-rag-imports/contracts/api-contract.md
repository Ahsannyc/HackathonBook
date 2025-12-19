# API Contract: RAG System with Cohere Support

## Provider Configuration

### Environment Variables
- `PROVIDER_TYPE`: String - Either "openai" or "cohere" (default: "openai")
- `COHERE_API_KEY`: String - Cohere API key (optional, enables Cohere support)
- `OPENAI_API_KEY`: String - OpenAI API key (required)
- `QDRANT_API_KEY`: String - Qdrant API key (required)

## Endpoints

### Query Endpoint (`/rag/query`)
- **Method**: POST
- **Provider**: Uses configured provider (OpenAI or Cohere)
- **Input**: Query string and optional session/user info
- **Output**: Answer based on retrieved context with configured provider

### Selected Text Query Endpoint (`/rag/selected_text_query`)
- **Method**: POST
- **Provider**: Uses configured provider (OpenAI or Cohere)
- **Input**: Query string, selected text, and optional session/user info
- **Output**: Answer based only on selected text with configured provider

## Fallback Behavior
- If Cohere is selected but API key is invalid/missing, falls back to OpenAI
- Error responses maintain same format regardless of provider