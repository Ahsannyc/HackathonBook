# Implementation Tasks: Embedded RAG Chatbot for Published Book

## Feature Overview
Implement a Retrieval-Augmented Generation (RAG) chatbot system for the published book that uses OpenAI Agents/ChatKit, FastAPI, Neon Serverless Postgres, and Qdrant Cloud to provide accurate, source-grounded answers from book content. The system will support two retrieval modes (full-book and user-selected text only), implement proper ingestion/chunking/embedding pipelines, and embed seamlessly in the book UI without breaking existing functionality. The implementation will prioritize production safety, asynchronous processing, and cost optimization while enforcing strict source grounding to prevent hallucinations.

## Implementation Strategy
- MVP approach: Start with core RAG functionality (US1), then add selected text mode (US2), then UI integration (US3)
- Each user story is independently testable and deliverable
- Parallel development possible for backend and frontend components
- Focus on source grounding and preventing hallucinations throughout

## Dependencies
- User Story 2 (US2) depends on foundational RAG setup from Phase 2
- User Story 3 (US3) depends on API endpoints from US1 and US2
- All RAG components depend on foundational setup tasks

## Parallel Execution Examples
- RAG backend service can be developed in parallel with frontend proxy service
- Book ingestion pipeline can be developed separately from query endpoints
- UI component can be developed in parallel with API implementation
- Unit tests can be written in parallel with implementation

---

## Phase 1: Setup
**Goal**: Initialize project structure and install dependencies for RAG chatbot integration

- [x] T001 Create rag-backend directory structure: rag-backend/{main.py,rag.py,ingestion.py,models.py,db.py,config.py}
- [x] T002 [P] Install Python dependencies: pip install fastapi uvicorn openai qdrant-client sqlalchemy psycopg2-binary python-dotenv
- [x] T003 [P] Install TypeScript/JavaScript dependencies: npm install axios for proxy service
- [x] T004 Create requirements.txt with all Python dependencies for rag-backend
- [x] T005 Create environment configuration for OpenAI, Qdrant, and Neon credentials
- [x] T006 Set up TypeScript configuration for backend proxy service
- [x] T007 [P] Set up testing frameworks: pytest for backend, jest for frontend proxy

---

## Phase 2: Foundational Components
**Goal**: Implement core RAG infrastructure needed by all user stories

- [x] T008 Create Qdrant client configuration for vector database access in rag-backend/config.py
- [x] T009 Create Neon database connection and session management in rag-backend/db.py
- [x] T010 [P] Implement Book Content Chunk model in rag-backend/models.py following data model specifications
- [x] T011 [P] Implement Document Metadata model in rag-backend/models.py following data model specifications
- [x] T012 [P] Implement User Session model in rag-backend/models.py following data model specifications
- [x] T013 [P] Implement Chat Message model in rag-backend/models.py following data model specifications
- [x] T014 [P] Implement Selection Context model in rag-backend/models.py following data model specifications
- [x] T015 Create core RAG system class in rag-backend/rag.py with initialization methods
- [x] T016 [P] Create ingestion pipeline class in rag-backend/ingestion.py with chunking methods
- [x] T017 Create embedding service with OpenAI integration in rag-backend/rag.py
- [x] T018 [P] Create RAG proxy service in backend/src/services/rag-proxy.ts for frontend integration
- [x] T019 [P] Create book content ingestion endpoint in rag-backend/main.py
- [x] T020 [P] Create health check endpoint in rag-backend/main.py
- [x] T021 Implement proper error handling and logging throughout RAG services

---

## Phase 3: User Story 1 - Full Book Content Retrieval (Priority: P1)
**Goal**: Implement RAG chatbot that searches entire book and provides accurate answers with source citations

**Independent Test**: Can be fully tested by asking various questions about the book content and verifying answers come from book content with proper citations, delivering the ability to get accurate information from the entire book.

- [x] T022 [US1] Implement semantic chunking algorithm in rag-backend/ingestion.py
- [x] T023 [P] [US1] Implement embedding generation for book chunks using OpenAI in rag-backend/rag.py
- [x] T024 [P] [US1] Implement vector storage in Qdrant for book content in rag-backend/rag.py
- [x] T025 [US1] Implement full-book retrieval method in rag-backend/rag.py
- [x] T026 [P] [US1] Create /rag/query endpoint in rag-backend/main.py for full-book queries
- [x] T027 [P] [US1] Implement OpenAI Assistant integration for answer generation in rag-backend/rag.py
- [x] T028 [US1] Add source citation functionality to include document references in answers
- [x] T029 [P] [US1] Implement strict source grounding to prevent hallucinations in rag-backend/rag.py
- [x] T030 [US1] Test that full-book queries return accurate answers with proper citations
- [x] T031 [P] [US1] Create unit tests for full-book retrieval functionality in rag-backend/tests/

---

## Phase 4: User Story 2 - User-Selected Text Retrieval (Priority: P1)
**Goal**: Implement RAG chatbot that answers exclusively from user-selected text without referencing other parts of the book

**Independent Test**: Can be tested by selecting text, asking questions about it, and verifying the chatbot answers only from the selected text without external content, delivering context-specific answers.

- [x] T032 [US2] Implement temporary vector creation from selected text in rag-backend/rag.py
- [x] T033 [P] [US2] Create /rag/selected_text_query endpoint in rag-backend/main.py
- [x] T034 [P] [US2] Implement selected-text-only retrieval mode in rag-backend/rag.py
- [x] T035 [US2] Add constraint to ensure answers only come from selected text context
- [x] T036 [P] [US2] Implement session management for selected text context in rag-backend/rag.py
- [x] T037 [US2] Add proper validation for selected text length and content in rag-backend/rag.py
- [x] T038 [P] [US2] Test that selected-text queries return answers only from selection without external content
- [x] T039 [US2] Create unit tests for selected-text retrieval functionality in rag-backend/tests/

---

## Phase 5: User Story 3 - Embedded Chatbot Interface (Priority: P2)
**Goal**: Implement seamlessly integrated chatbot widget that doesn't interfere with existing book UI

**Independent Test**: Can be tested by navigating through book pages and verifying the chatbot is present and functional without breaking existing UI elements, delivering seamless integration.

- [x] T040 [US3] Create RagChat React component in book/src/components/RagChat.jsx
- [x] T041 [P] [US3] Implement chat UI with message display and input functionality in RagChat.jsx
- [x] T042 [P] [US3] Add text selection detection functionality in RagChat.jsx
- [x] T043 [US3] Connect RagChat to backend proxy service in backend/src/services/rag-proxy.ts
- [x] T044 [P] [US3] Implement dual-mode switching (full-book vs selected-text) in RagChat.jsx
- [x] T045 [US3] Add proper styling that doesn't conflict with existing book styles in RagChat.jsx
- [x] T046 [P] [US3] Implement session persistence for chat conversations in RagChat.jsx
- [x] T047 [US3] Add loading states and error handling in RagChat.jsx
- [x] T048 [P] [US3] Test that chatbot integrates without breaking existing book functionality
- [x] T049 [US3] Create integration tests for UI component in book/tests/

---

## Phase 6: Testing and Validation
**Goal**: Ensure all RAG functionality works correctly and meets success criteria

- [x] T050 Test that full-book retrieval returns accurate answers with proper citations (SC-001, SC-006)
- [x] T051 Test that selected-text mode prevents external content leakage (SC-003)
- [x] T052 Validate zero hallucination responses in strict source grounding mode (SC-002)
- [x] T053 Test ingestion pipeline completes within 30 minutes for 500 pages (SC-005)
- [x] T054 Validate chatbot UI integrates without breaking existing functionality (SC-007)
- [x] T055 Test system handles 100 concurrent users (SC-008)
- [x] T056 Verify response times under 5 seconds (SC-001)
- [x] T057 Run all unit and integration tests to ensure no regressions
- [x] T058 Test error handling for unavailable services (Qdrant, OpenAI, Neon)
- [x] T059 Perform end-to-end testing of complete RAG flow with both modes

---

## Phase 7: Polish & Cross-Cutting Concerns
**Goal**: Final improvements and production readiness

- [x] T060 Add comprehensive logging for production monitoring
- [x] T061 [P] Implement caching for frequent queries to optimize costs (FR-010)
- [x] T062 Add rate limiting and request validation (FR-012)
- [x] T063 [P] Optimize embedding and retrieval performance
- [x] T064 Add analytics for RAG usage patterns
- [x] T065 [P] Create deployment configuration for production environment
- [x] T066 Add proper fallback mechanisms for service unavailability (FR-011)
- [x] T067 [P] Update documentation for RAG system administration
- [x] T068 Add comprehensive error messages and user feedback
- [x] T069 Final testing on production-like environment