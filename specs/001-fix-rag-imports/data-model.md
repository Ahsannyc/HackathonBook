# Data Model: Fix RAG System Imports and Add Cohere Support

## Configuration Entities

### CohereConfig
- **api_key**: String - Cohere API key for authentication
- **model**: String - Default Cohere model for text generation (default: "command-r-plus")
- **embedding_model**: String - Default Cohere model for embeddings (default: "embed-multilingual-v3.0")
- **timeout**: Integer - Request timeout in seconds (default: 30)

### ProviderAbstraction
- **EmbeddingProvider**: Interface for generating text embeddings
  - embed_text(text: String) -> List[float]
- **GenerationProvider**: Interface for generating text responses
  - generate_response(prompt: String, context: String) -> String

## State Transitions

### Provider Selection
- **Default**: OpenAI provider active
- **Configuration**: When COHERE_API_KEY is present, provider can be switched via config
- **Fallback**: When Cohere unavailable, automatically falls back to OpenAI

## Validation Rules

- Cohere API key must be present if Cohere provider is selected
- Provider selection must be validated at startup
- Fallback mechanism must be tested for reliability