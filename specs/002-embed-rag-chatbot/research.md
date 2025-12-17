# Research: Embedded RAG Chatbot for Published Book

**Feature**: `002-embed-rag-chatbot`
**Date**: 2025-12-17
**Spec**: [specs/002-embed-rag-chatbot/spec.md](specs/002-embed-rag-chatbot/spec.md)

## Overview

This research document addresses the technical requirements for implementing an embedded RAG chatbot that uses OpenAI Agents/ChatKit, FastAPI, Neon Serverless Postgres, and Qdrant Cloud to provide accurate, source-grounded answers from book content.

## Technology Research

### OpenAI Agents/ChatKit Integration

**Decision**: Use OpenAI Assistant API with Retrieval tool for RAG functionality
**Rationale**: The Assistant API provides built-in retrieval capabilities that work well with vector databases like Qdrant. It handles the complexity of retrieval and generation in a managed way.
**Alternatives considered**:
- OpenAI Functions API: More control but requires manual orchestration
- LangChain: More complex but more flexible
- Direct OpenAI completions: Requires more manual management

### FastAPI Backend Framework

**Decision**: Use FastAPI for the RAG backend service
**Rationale**: FastAPI provides excellent performance, built-in async support, automatic API documentation, and strong typing which is ideal for RAG services.
**Alternatives considered**:
- Flask: Simpler but slower and less async-friendly
- Django: Too heavy for this use case
- Express.js: Would require Node.js instead of Python

### Vector Database: Qdrant Cloud

**Decision**: Use Qdrant Cloud for vector storage and retrieval
**Rationale**: Qdrant provides excellent performance for similarity search, supports metadata filtering (important for our dual-mode retrieval), and has good Python SDK support.
**Alternatives considered**:
- Pinecone: Good but more expensive
- Weaviate: Good alternative but Qdrant has better filtering for our use case
- Chroma: Open source but less scalable

### SQL Database: Neon Serverless Postgres

**Decision**: Use Neon Serverless Postgres for metadata and session storage
**Rationale**: Neon provides serverless Postgres with excellent scalability, built-in branching capabilities, and full Postgres compatibility for complex queries.
**Alternatives considered**:
- Supabase: Similar but Neon is more focused on serverless
- AWS RDS: More complex setup
- SQLite: Not suitable for production multi-user scenarios

## Architecture Patterns

### Dual-Mode Retrieval Implementation

**Decision**: Implement two separate retrieval strategies using Qdrant filtering
**Rationale**: Qdrant's metadata filtering allows us to implement both full-book and selected-text-only modes using the same vector store with different query filters.
**Implementation approach**:
- Full-book mode: Query all book content vectors
- Selected-text mode: Create temporary vectors from selected text and limit scope

### Content Ingestion Pipeline

**Decision**: Implement chunking → embedding → storage pipeline
**Rationale**: Proper content chunking ensures good context windows for embeddings while maintaining semantic meaning.
**Approach**:
- Use semantic chunking rather than fixed-size chunking
- Store chunk metadata in Neon for proper citations
- Implement overlap to preserve context across chunks

### Frontend Integration Strategy

**Decision**: Embed React component in existing book UI without modifications
**Rationale**: Use React Shadow DOM or CSS isolation to prevent style conflicts with existing book styles.
**Implementation**:
- Create self-contained chatbot component
- Use CSS modules or Shadow DOM for style isolation
- Implement as drop-in component that doesn't affect existing functionality

## Security & Production Considerations

### Source Grounding Enforcement

**Decision**: Implement strict context injection and monitoring
**Rationale**: Use system prompts and output validation to ensure answers only come from provided context.
**Approach**:
- Context injection with clear boundaries
- Output validation to detect hallucinations
- Confidence scoring for retrieved content

### Cost Optimization

**Decision**: Implement caching, smart embeddings, and usage monitoring
**Rationale**: RAG systems can be expensive; optimization is critical for sustainability.
**Approaches**:
- Cache frequent queries and their results
- Use embedding similarity to avoid redundant API calls
- Implement usage quotas and monitoring

## Technical Unknowns Resolved

All technical requirements from the specification have been researched and viable approaches identified. No major technical blockers exist for the implementation.

## Next Steps

1. Design data models based on research findings
2. Create API contracts for the RAG service
3. Implement the ingestion pipeline
4. Build the core RAG service with dual-mode retrieval
5. Integrate with frontend