# Implementation Plan: Fix RAG System Imports, Add Cohere Support, and Integrate Frontend with RAG Backend

**Branch**: `001-fix-rag-imports` | **Date**: 2025-12-24 | **Spec**: [specs/001-fix-rag-imports/spec.md]
**Input**: Feature specification from `/specs/001-fix-rag-imports/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement fixes for Qdrant client imports, add Cohere integration to the RAG system, and integrate the frontend with the RAG backend. The plan includes updating import statements to use proper Qdrant models, creating an abstraction layer to support both OpenAI and Cohere providers, extending configuration to support Cohere API keys while maintaining backward compatibility, and updating the server configuration to serve the frontend from the root URL while preserving API functionality. Based on research, the Qdrant imports are already correct, so focus will be on Cohere integration, configuration updates, and frontend-backend integration.

## Technical Context

**Language/Version**: Python 3.11, TypeScript/JavaScript
**Primary Dependencies**: FastAPI, OpenAI, Qdrant Client, Cohere, Express.js, Docusaurus
**Storage**: Neon Serverless Postgres (metadata), Qdrant Cloud (vector storage), SQLite (local development)
**Testing**: pytest with unit and integration tests
**Target Platform**: Linux server (Railway deployment)
**Project Type**: web (backend API with frontend)
**Performance Goals**: Maintain current response times with Cohere integration, support 1000+ concurrent users
**Constraints**: <200ms p95 latency, maintain 99% backward compatibility, graceful fallback when Cohere unavailable, serve frontend from root URL
**Scale/Scope**: Support 10k+ users, 1M+ document chunks in vector database

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Reproducibility**: All changes will maintain full reproducibility for RAG workflows
- **Grounded RAG System**: Cohere integration will maintain strict source grounding requirements
- **Secure and Private Features**: New API key configurations will follow secure practices
- **Feature Reliability**: All required features (auth, RAG, personalization) must continue to function
- **Technical Reproducibility**: All technical components remain fully reproducible
- **User Experience**: Frontend integration will ensure users see the documentation site instead of API error messages

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-rag-imports/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
rag-backend/
├── main.py              # FastAPI application with RAG endpoints
├── rag.py               # Core RAG system with provider abstraction
├── ingestion.py         # Content processing with updated imports
├── config.py            # Configuration with Cohere support
├── models.py            # Database models
├── db.py                # Database operations
└── requirements.txt     # Dependencies including Cohere

backend/
└── src/
    └── server.ts        # Express server with static file serving and API proxy
    └── services/
        └── rag-proxy.ts # Proxy to forward requests to Python RAG backend

book/
└── build/               # Built Docusaurus frontend files
```

**Structure Decision**: Web application backend structure chosen as this is a RAG API service. The existing rag-backend directory contains the Python FastAPI application that provides RAG functionality to the frontend. The Express server in backend/src/ serves the frontend and acts as a proxy for API requests.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Provider abstraction pattern | Support for multiple AI providers as specified in requirements | Direct API calls would prevent switching between providers |
| Frontend-backend integration | Users need to see documentation site instead of API error messages | Would result in poor user experience |
