# Quickstart Guide: Embedded RAG Chatbot for Published Book

**Feature**: `002-embed-rag-chatbot`
**Date**: 2025-12-17
**Spec**: [specs/002-embed-rag-chatbot/spec.md](specs/002-embed-rag-chatbot/spec.md)

## Overview

This guide provides a quick start for setting up and using the RAG chatbot system that integrates OpenAI Agents/ChatKit, FastAPI, Neon Serverless Postgres, and Qdrant Cloud to provide accurate, source-grounded answers from book content.

## Prerequisites

- Python 3.11+ for the RAG backend
- Node.js 18+ for the frontend proxy
- Access to OpenAI API (with appropriate rate limits)
- Qdrant Cloud account with API key
- Neon Serverless Postgres database
- Book content in text/markdown format

## Environment Setup

### 1. Backend Environment (RAG Service)

```bash
# Navigate to rag-backend directory
cd rag-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your actual keys:
# OPENAI_API_KEY=your_openai_key
# QDRANT_URL=your_qdrant_cluster_url
# QDRANT_API_KEY=your_qdrant_api_key
# NEON_DATABASE_URL=your_neon_connection_string
```

### 2. Frontend Proxy Environment

```bash
# From the project root
cd backend

# Install Node dependencies
npm install

# The proxy service will use environment variables from the main .env file
```

## Running the Services

### 1. Start the RAG Backend Service

```bash
# From rag-backend directory
cd rag-backend
source venv/bin/activate  # Activate your Python environment

# Run the FastAPI service
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Start the Frontend Proxy

```bash
# From project root
npm run dev:backend
```

### 3. Ingest Book Content

```bash
# Use the ingestion API to add book content
curl -X POST http://localhost:8000/rag/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "book_id": "robotics_handbook_v1",
    "title": "Robotics Handbook",
    "content": "Your book content here..."
  }'
```

## API Usage Examples

### 1. Full Book Query

```bash
curl -X POST http://localhost:8000/rag/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "Explain forward kinematics in robotics",
    "session_id": "session_123",
    "book_id": "robotics_handbook_v1"
  }'
```

### 2. Selected Text Query

```bash
curl -X POST http://localhost:8000/rag/selected_text_query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "What does this mean?",
    "selected_text": "Forward kinematics is the process of determining the position and orientation of the end-effector...",
    "session_id": "session_123",
    "book_id": "robotics_handbook_v1"
  }'
```

## Frontend Integration

The RAG chatbot is integrated into the book UI through the RagChat component. It's designed to work seamlessly with the existing book interface:

1. The component is loaded on all book pages
2. It connects to the backend proxy at `/rag/*` endpoints
3. It maintains session context across page navigation
4. It supports both full-book and selected-text query modes

## Testing the System

### 1. Health Check

```bash
curl http://localhost:8000/rag/health
```

### 2. Basic Query Test

```bash
curl -X POST http://localhost:8000/rag/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "What is the main topic of this book?",
    "book_id": "robotics_handbook_v1"
  }'
```

## Troubleshooting

### Common Issues

1. **Connection errors**: Verify all service endpoints are running and environment variables are set correctly
2. **Authentication errors**: Check that your API keys are valid and properly formatted
3. **Empty responses**: Ensure book content has been properly ingested into the system
4. **Slow responses**: Check your OpenAI API rate limits and Qdrant performance

### Performance Optimization

- Use caching for frequently asked questions
- Implement proper chunking to optimize retrieval
- Monitor API usage to stay within rate limits
- Use async processing where possible

## Next Steps

1. Complete the full book content ingestion
2. Test the dual-mode retrieval (full-book vs selected text)
3. Verify source grounding and citation accuracy
4. Test the frontend integration with existing book UI