# Feature Specification: Fix RAG System Imports, Add Cohere Support, and Integrate Frontend with RAG Backend

**Feature Branch**: `001-fix-rag-imports`
**Created**: 2025-12-19
**Status**: Draft
**Input**: User description: "you havent imported vectorParams, distance, pointStruct from Qdrant_client.models and import cohere, and then you also may need Qdrant and coeher api keys or tokens etc for the RAG chatbot? Also fix the issue where users see API endpoint error messages instead of the frontend."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Fix Qdrant Client Imports (Priority: P1)

As a developer maintaining the RAG system, I need to ensure proper imports from qdrant_client.models to prevent import errors and ensure the system works with the latest Qdrant client version.

**Why this priority**: This is critical for the system's stability and prevents runtime errors that could break the RAG functionality.

**Independent Test**: Can be fully tested by running the RAG system and verifying that vector storage and retrieval operations work without import errors.

**Acceptance Scenarios**:

1. **Given** a running RAG system, **When** I attempt to store content chunks in Qdrant, **Then** the system successfully imports VectorParams, Distance, and PointStruct from qdrant_client.models and stores the vectors without errors
2. **Given** a running RAG system, **When** I attempt to retrieve content chunks from Qdrant, **Then** the system successfully uses the imported models and returns relevant results

---

### User Story 2 - Add Cohere Integration Support (Priority: P2)

As a user of the RAG system, I want to have the option to use Cohere's embedding and generation models alongside OpenAI, providing flexibility and redundancy in the system.

**Why this priority**: This provides vendor diversity and allows users to choose the best model provider for their specific needs and budget.

**Independent Test**: Can be fully tested by configuring the system to use Cohere and verifying that embedding generation and text generation work correctly.

**Acceptance Scenarios**:

1. **Given** Cohere API credentials are configured, **When** I request to generate embeddings using Cohere, **Then** the system successfully uses Cohere's embedding API to create vector representations
2. **Given** Cohere API credentials are configured, **When** I submit a query to the RAG system, **Then** the system can optionally use Cohere's language model to generate responses

---

### User Story 3 - Integrate Frontend and RAG Backend (Priority: P1)

As a user accessing the HackathonBook application, I want to see the frontend documentation site when I visit the main URL, while still having access to the RAG chatbot functionality through the appropriate API endpoints.

**Why this priority**: This is critical for user experience - users should see the frontend instead of API error messages, and all functionality should work together seamlessly.

**Independent Test**: Can be fully tested by accessing the root URL and verifying the frontend loads, while API endpoints remain accessible.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** I visit the root URL (http://localhost:3000/), **Then** I see the Docusaurus frontend instead of an API endpoint error message
2. **Given** the application is running, **When** I access API endpoints like /health, /api/auth/*, or /rag/*, **Then** the API responses work as expected
3. **Given** the application is running, **When** I access the RAG health endpoint at /rag/health, **Then** I get a proper health response from both the proxy and the backend

---

### User Story 4 - Configure Additional API Keys (Priority: P3)

As a system administrator, I need to properly configure all required API keys and environment variables to ensure the RAG system can connect to all necessary services.

**Why this priority**: This ensures the system can be properly deployed in different environments with all required services.

**Independent Test**: Can be fully tested by setting up environment variables and verifying the system connects to all configured services.

**Acceptance Scenarios**:

1. **Given** all required API keys are set in environment variables, **When** the RAG system starts up, **Then** it successfully connects to OpenAI, Qdrant, and Cohere services without errors

---

### Edge Cases

- What happens when Cohere API keys are not configured but Cohere functionality is requested?
- How does the system handle invalid or expired API keys for any of the services?
- What happens when there are network connectivity issues to any of the external services?
- How does the system handle rate limiting from API providers?
- What happens when the RAG backend is not running but frontend tries to access it?
- How does the system handle requests when Qdrant credentials are not available?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST import VectorParams, Distance, and PointStruct from qdrant_client.models to ensure proper Qdrant vector operations
- **FR-002**: System MUST provide Cohere client integration as an alternative to OpenAI for embeddings and text generation
- **FR-003**: System MUST support configuration of Cohere API keys alongside existing OpenAI and Qdrant keys
- **FR-004**: System MUST maintain backward compatibility with existing OpenAI integration when Cohere is configured
- **FR-005**: System MUST provide configuration options to select between OpenAI and Cohere as the active provider
- **FR-006**: System MUST handle missing Cohere API keys gracefully without breaking existing functionality
- **FR-007**: System MUST validate API key configurations at startup and provide clear error messages
- **FR-008**: System MUST serve the frontend (Docusaurus site) from the root URL instead of showing API endpoint error messages
- **FR-009**: System MUST continue to provide access to API endpoints for authentication and RAG functionality
- **FR-010**: System MUST properly proxy RAG requests from the frontend to the Python RAG backend
- **FR-011**: System MUST handle cases where Qdrant credentials are not available by using in-memory storage for development
- **FR-012**: System MUST serve static files from the book/build directory for frontend functionality
- **FR-013**: System MUST ensure proper routing precedence so that specific API endpoints (like /health, /api/*, /rag/*) are handled correctly before static file serving

### Key Entities

- **QdrantConfig**: Configuration parameters for connecting to Qdrant vector database, including URL and API key
- **OpenAIConfig**: Configuration parameters for connecting to OpenAI services, including API key and model selection
- **CohereConfig**: Configuration parameters for connecting to Cohere services, including API key and model selection
- **EmbeddingProvider**: Abstract interface for generating embeddings that can be implemented by OpenAI or Cohere
- **GenerationProvider**: Abstract interface for text generation that can be implemented by OpenAI or Cohere
- **FrontendServer**: Express server configuration that serves static files and proxies API requests
- **RAGProxy**: Component that forwards requests from frontend to Python RAG backend
- **StaticFileHandler**: Component that serves built Docusaurus frontend files

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: RAG system successfully imports VectorParams, Distance, and PointStruct from qdrant_client.models without runtime errors
- **SC-002**: System can generate embeddings using Cohere API when configured, with performance comparable to OpenAI (within 20% response time)
- **SC-003**: System maintains 99% backward compatibility with existing OpenAI-based functionality when Cohere is added
- **SC-004**: All API key configurations (OpenAI, Qdrant, Cohere) are validated at startup with clear error messages when missing
- **SC-005**: Developers can switch between OpenAI and Cohere providers through configuration without code changes
- **SC-006**: System handles missing Cohere API keys gracefully by falling back to OpenAI without service interruption
- **SC-007**: Users accessing the root URL see the Docusaurus frontend instead of API endpoint error messages
- **SC-008**: All API endpoints (health, auth, rag) remain accessible and functional after frontend integration
- **SC-009**: RAG health check endpoint returns healthy status from both proxy and backend services
- **SC-010**: System can run with in-memory Qdrant storage when credentials are not provided for development
- **SC-011**: Static file serving from book/build directory works without interfering with API endpoints
- **SC-012**: Specific API routes take precedence over static file serving, ensuring proper routing for /health, /api/*, and /rag/* endpoints
