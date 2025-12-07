# Hackathon Book RAG Chatbot

This RAG (Retrieval-Augmented Generation) chatbot provides an AI-powered interface to answer questions about the Hackathon Book content using vector search and language models.

## Architecture

The system consists of:
- **FastAPI Backend**: Handles API requests and orchestrates the RAG pipeline
- **Qdrant Cloud**: Vector database for document embeddings and retrieval
- **Neon Serverless Postgres**: Stores chat logs and metadata
- **OpenAI API**: Language model for generating responses
- **React Component**: Frontend chat interface for Docusaurus

## Components

### Backend (`/rag-backend/`)
- `main.py`: FastAPI server with API endpoints
- `rag.py`: RAG logic with embedding and retrieval
- `ingestion.py`: Document processing and vector storage
- `db.py`: Database connection and session management
- `models.py`: Database schema definitions
- `requirements.txt`: Python dependencies

### Frontend (`/docs/src/components/RagChat.jsx`)
- React component for chat interface
- Text selection functionality
- Integration with Docusaurus

## Environment Variables

Create a `.env` file in the `rag-backend` directory with:

```bash
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
NEON_DATABASE_URL=your_neon_database_connection_string
LLM_MODEL=gpt-4o-mini
```

## Deployment Instructions

### 1. Set up Qdrant Cloud
1. Go to [Qdrant Cloud](https://cloud.qdrant.io/)
2. Create a free account
3. Create a new cluster
4. Note down the URL and API key

### 2. Set up Neon Serverless Postgres
1. Go to [Neon](https://neon.tech/)
2. Create a new project
3. Get the connection string from Project Settings
4. The database tables will be created automatically

### 3. Set up OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Save it securely

### 4. Deploy the Backend
Choose one of these platforms:

#### Option A: Render
1. Fork this repository
2. Create a new Web Service on Render
3. Connect to your forked repository
4. Set the build command to `pip install -r rag-backend/requirements.txt`
5. Set the start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add the environment variables in Render dashboard
7. Deploy

#### Option B: Railway
1. Install Railway CLI or connect via dashboard
2. Create a new project
3. Add the environment variables
4. Deploy with the command: `uvicorn rag-backend.main:app --host 0.0.0.0 --port $PORT`

#### Option C: Fly.io
1. Install flyctl
2. Run `fly launch` in the rag-backend directory
3. Add secrets: `fly secrets set OPENAI_API_KEY=...`
4. Deploy: `fly deploy`

### 5. Configure Docusaurus Frontend
1. Add the proxy configuration to `docusaurus.config.js`:
```js
module.exports = {
  // ... other config
  themes: [
    // ... other themes
  ],
  plugins: [
    // Add this proxy plugin
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
        toExtensions: ['html'],
      },
    ],
  ],
  themes: ['@docusaurus/theme-classic'],
  // Add proxy configuration
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  // Add this server config for development
  staticDirectories: ['static'],
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
};
```

2. For development, you can add a proxy in package.json:
```json
{
  "name": "docs",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "docusaurus start",
    // ... other scripts
  },
  "devDependencies": {
    // ... dependencies
  },
  "browserslist": {
    // ... browserslist config
  },
  "engines": {
    "node": ">=20.0"
  },
  "proxy": "http://localhost:8000"  // Backend server URL
}
```

### 6. Ingest Documents
1. Run the ingestion script to process all markdown files:
```bash
cd rag-backend
python ingestion.py
```

This will read all markdown files from the `docs` directory, chunk them, generate embeddings, and store them in Qdrant.

### 7. Test the API
After deployment, test the endpoints:
- `GET /` - Health check
- `POST /rag/query` - General questions
- `POST /rag/selected_text_query` - Questions about selected text

### 8. Add Chat Component to Pages
To add the chatbot to specific pages, import and use the component:

```jsx
import RagChat from '@site/src/components/RagChat';

// In your MDX file:
<RagChat />
```

## API Endpoints

### `POST /rag/query`
Request body:
```json
{
  "query": "Your question here",
  "session_id": "optional session ID",
  "user_id": "optional user ID"
}
```

Response:
```json
{
  "answer": "Generated answer",
  "source_chunks": ["relevant document chunks"],
  "session_id": "session ID"
}
```

### `POST /rag/selected_text_query`
Request body:
```json
{
  "query": "Your question here",
  "selected_text": "The text selected by the user",
  "session_id": "optional session ID",
  "user_id": "optional user ID"
}
```

Response:
```json
{
  "answer": "Generated answer based only on selected text",
  "session_id": "session ID"
}
```

## Safety & Grounding Rules

The system follows strict grounding rules:
- Answers are generated only from retrieved content or selected text
- If information is not present, it responds: "I don't know — it's not in the provided content"
- Never generates ungrounded information

## Troubleshooting

1. **API Rate Limits**: If you encounter rate limits, consider adding request throttling or upgrading your API plan.

2. **Vector Search Issues**: If queries return irrelevant results, check the embedding quality and adjust the similarity threshold.

3. **Database Connection**: Ensure your Neon connection string is properly formatted and has the necessary permissions.

4. **CORS Issues**: If the frontend can't connect to the backend, check CORS settings in main.py.