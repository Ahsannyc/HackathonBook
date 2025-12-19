# Implementation Tasks: Fix RAG System Imports and Add Cohere Support

**Feature**: Fix RAG System Imports and Add Cohere Support
**Branch**: 001-fix-rag-imports
**Created**: 2025-12-19
**Input**: Feature specification from spec.md, implementation plan from plan.md

## Dependencies

- **User Story 1 (P1)**: Core functionality - no dependencies
- **User Story 2 (P2)**: Depends on US1 for basic structure
- **User Story 3 (P3)**: Depends on US1 and US2 for configuration

## Parallel Execution Examples

- **US1**: Import fixes can be done in parallel with requirements update
- **US2**: Provider abstraction and Cohere implementation can be developed in parallel after core structure
- **US3**: Configuration updates can be done in parallel with provider implementation

## Implementation Strategy

**MVP Scope**: User Story 1 (Fix Qdrant imports) - This ensures system stability and forms the foundation for additional features.

**Incremental Delivery**:
1. Phase 1-2: Setup and foundational work
2. Phase 3: Core import fixes (MVP)
3. Phase 4: Cohere integration
4. Phase 5: Configuration updates
5. Phase 6: Polish and validation

---

## Phase 1: Setup

### Goal
Initialize project with required dependencies and configuration for Cohere integration.

- [X] T001 Update requirements.txt to include cohere package
- [X] T002 Verify existing qdrant_client imports are correct in rag-backend/ingestion.py
- [X] T003 Verify existing qdrant_client imports are correct in rag-backend/rag.py

## Phase 2: Foundational

### Goal
Create abstract provider interfaces that will support both OpenAI and Cohere implementations.

- [X] T004 Create abstract EmbeddingProvider interface in rag-backend/providers/base.py
- [X] T005 Create abstract GenerationProvider interface in rag-backend/providers/base.py
- [X] T006 Update RAGSystem to use provider abstraction in rag-backend/rag.py

## Phase 3: User Story 1 - Fix Qdrant Client Imports (P1)

### Goal
Ensure proper imports from qdrant_client.models and verify all Qdrant operations work correctly.

### Independent Test
Can be fully tested by running the RAG system and verifying that vector storage and retrieval operations work without import errors.

- [X] T007 [US1] Update ingestion.py to use proper qdrant_client.models imports
- [X] T008 [US1] Update rag.py to use proper qdrant_client.models imports
- [X] T009 [US1] Test vector storage operations in Qdrant
- [X] T010 [US1] Test vector retrieval operations in Qdrant

## Phase 4: User Story 2 - Add Cohere Integration Support (P2)

### Goal
Implement Cohere client integration as an alternative to OpenAI for embeddings and text generation.

### Independent Test
Can be fully tested by configuring the system to use Cohere and verifying that embedding generation and text generation work correctly.

- [X] T011 [P] [US2] Create CohereEmbeddingProvider in rag-backend/providers/cohere.py
- [X] T012 [P] [US2] Create CohereGenerationProvider in rag-backend/providers/cohere.py
- [X] T013 [P] [US2] Create OpenAIEmbeddingProvider wrapper in rag-backend/providers/openai.py
- [X] T014 [P] [US2] Create OpenAIGenerationProvider wrapper in rag-backend/providers/openai.py
- [X] T015 [US2] Update RAGSystem to support configurable providers
- [X] T016 [US2] Implement embedding provider selection logic
- [X] T017 [US2] Implement generation provider selection logic
- [X] T018 [US2] Test Cohere embedding generation
- [X] T019 [US2] Test Cohere text generation

## Phase 5: User Story 3 - Configure Additional API Keys (P3)

### Goal
Properly configure all required API keys and environment variables to ensure the RAG system can connect to all necessary services.

### Independent Test
Can be fully tested by setting up environment variables and verifying the system connects to all configured services.

- [X] T020 [US3] Update config.py to include Cohere configuration options
- [X] T021 [US3] Add PROVIDER_TYPE setting to select between OpenAI and Cohere
- [X] T022 [US3] Implement API key validation at startup
- [X] T023 [US3] Add graceful fallback when Cohere is not configured
- [X] T024 [US3] Test configuration validation
- [X] T025 [US3] Test fallback behavior to OpenAI when Cohere unavailable

## Phase 6: Polish & Cross-Cutting Concerns

### Goal
Final validation, testing, and documentation updates.

- [X] T026 Update documentation with Cohere setup instructions
- [X] T027 Add error handling for Cohere API rate limits
- [X] T028 Test backward compatibility with existing OpenAI functionality
- [X] T029 Update tests to cover Cohere integration
- [X] T030 Run full integration test suite
- [X] T031 Update .env.example with Cohere variables
- [X] T032 Validate all success criteria from specification