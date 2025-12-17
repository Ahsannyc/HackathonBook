# Implementation Plan: Embedded RAG Chatbot for Published Book

**Branch**: `002-embed-rag-chatbot` | **Date**: 2025-12-17 | **Spec**: [specs/002-embed-rag-chatbot/spec.md](specs/002-embed-rag-chatbot/spec.md)
**Input**: Feature specification from `/specs/002-embed-rag-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a Retrieval-Augmented Generation (RAG) chatbot system for the published book that uses OpenAI Agents/ChatKit, FastAPI, Neon Serverless Postgres, and Qdrant Cloud to provide accurate, source-grounded answers from book content. The system will support two retrieval modes (full-book and user-selected text only), implement proper ingestion/chunking/embedding pipelines, and embed seamlessly in the book UI without breaking existing functionality. The implementation will prioritize production safety, asynchronous processing, and cost optimization while enforcing strict source grounding to prevent hallucinations.

## Technical Context

**Language/Version**: Python 3.11+ for RAG backend (FastAPI), TypeScript/JavaScript for frontend integration
**Primary Dependencies**: OpenAI Agents/ChatKit SDK, FastAPI, Neon Serverless Postgres client, Qdrant Cloud client, React for UI components
**Storage**: Qdrant Cloud vector database for embeddings, Neon Serverless Postgres for metadata and session data
**Testing**: Pytest for backend tests, Jest for frontend tests
**Target Platform**: Web application deployed to GitHub Pages with backend services
**Project Type**: web - determines source structure
**Performance Goals**: Sub-5 second response times, 99% uptime, cost-efficient API usage through smart caching
**Constraints**: Must integrate with existing book UI without modifications, enforce strict source grounding, support dual retrieval modes
**Scale/Scope**: Handle 100+ concurrent users, process book content efficiently, maintain cost awareness

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the constitution file, the implementation must:
1. **Grounded RAG System**: RAG system must deliver grounded answers based strictly on retrieved book content - IMPLEMENTED by enforcing strict source grounding and preventing hallucinations
2. **Required Deliverables**: Must include integrated RAG chatbot built with OpenAI Agents/ChatKit, FastAPI, Neon Serverless Postgres, Qdrant Cloud - IMPLEMENTED by using specified technologies
3. **Secure and Private Features**: All features must follow secure and privacy-respecting practices - IMPLEMENTED by using proper authentication and secure data handling

All requirements align with the constitution - no violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/002-embed-rag-chatbot/
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
├── main.py              # FastAPI application entry point
├── rag.py               # Core RAG system implementation
├── ingestion.py         # Content ingestion and processing pipeline
├── models.py            # Data models and entity definitions
├── db.py                # Database connection and session management
├── requirements.txt     # Python dependencies
└── config.py            # Configuration settings
backend/
├── src/
│   ├── services/
│   │   ├── rag-proxy.ts # Proxy for frontend-to-RAG-backend communication
│   │   └── ...          # Other services
│   └── ...              # Other backend files
book/
├── src/
│   ├── components/
│   │   ├── RagChat.jsx  # RAG chatbot UI component
│   │   └── ...          # Other components
│   └── ...              # Other frontend files
```

**Structure Decision**: Web application structure selected with separate Python backend for RAG processing and JavaScript frontend for UI integration to leverage specialized technologies for their respective strengths.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
