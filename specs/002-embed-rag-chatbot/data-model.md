# Data Model: Embedded RAG Chatbot for Published Book

**Feature**: `002-embed-rag-chatbot`
**Date**: 2025-12-17
**Spec**: [specs/002-embed-rag-chatbot/spec.md](specs/002-embed-rag-chatbot/spec.md)

## Entity Models

### Book Content Chunk
*Stored in Qdrant vector database*

- **chunk_id**: string (primary identifier for the chunk)
- **book_id**: string (identifier for the book this chunk belongs to)
- **content**: string (the actual text content of the chunk)
- **embedding**: float[] (vector embedding of the content)
- **section_title**: string (title of the section this chunk comes from)
- **page_number**: integer (page number in the original book)
- **chunk_number**: integer (sequential number of this chunk in the document)
- **metadata**: object (additional metadata like headings, tags, etc.)

### Document Metadata
*Stored in Neon Serverless Postgres*

- **id**: integer (primary key, auto-increment)
- **chunk_id**: string (foreign key to Qdrant chunk_id)
- **book_id**: string (identifier for the book)
- **section_title**: string (title of the section)
- **page_number**: integer (page number in original book)
- **chunk_number**: integer (sequential number in document)
- **source_url**: string (URL or path to original content)
- **created_at**: timestamp (when this chunk was created)
- **updated_at**: timestamp (when this chunk was last updated)
- **version**: string (version of the book content)

### User Session
*Stored in Neon Serverless Postgres*

- **id**: integer (primary key, auto-increment)
- **session_id**: string (unique identifier for the session)
- **user_id**: string (optional, user identifier if authenticated)
- **created_at**: timestamp (when session started)
- **updated_at**: timestamp (last activity in session)
- **active**: boolean (whether session is currently active)
- **book_id**: string (which book this session is for)

### Chat Message
*Stored in Neon Serverless Postgres*

- **id**: integer (primary key, auto-increment)
- **session_id**: string (foreign key to User Session)
- **message_id**: string (unique identifier for the message)
- **role**: string (either "user" or "assistant")
- **content**: string (the actual message content)
- **timestamp**: timestamp (when message was created)
- **sources**: json (array of source references for RAG responses)
- **query_type**: string (either "full_book" or "selection_only")

### Selection Context
*Stored in Neon Serverless Postgres*

- **id**: integer (primary key, auto-increment)
- **session_id**: string (foreign key to User Session)
- **selection_id**: string (unique identifier for this text selection)
- **selected_text**: string (the actual selected text)
- **book_id**: string (which book the selection is from)
- **page_number**: integer (page where text was selected)
- **section_title**: string (section where text was selected)
- **created_at**: timestamp (when selection was made)
- **expires_at**: timestamp (when selection expires from context)

## Relationships

- **User Session** (1) → (N) **Chat Message**: A session can have many chat messages
- **User Session** (1) → (N) **Selection Context**: A session can have many text selections
- **Chat Message** (N) → (N) **Book Content Chunk**: Messages reference multiple chunks for citations
- **Document Metadata** (N) → (1) **Book Content Chunk**: Multiple metadata entries map to vector chunks

## Validation Rules

### Book Content Chunk
- content must be between 50 and 2000 characters
- embedding must be a valid vector of the expected dimension
- book_id is required and must match existing book
- chunk_id must be unique

### Document Metadata
- chunk_id must reference an existing chunk in Qdrant
- page_number must be positive
- created_at and updated_at are automatically managed
- book_id is required

### User Session
- session_id must be unique
- created_at is automatically set on creation
- active defaults to true

### Chat Message
- session_id must reference an existing session
- role must be either "user" or "assistant"
- content is required
- sources must be valid JSON when present

### Selection Context
- session_id must reference an existing session
- selected_text is required and must be between 10 and 5000 characters
- expires_at defaults to 1 hour after creation

## State Transitions

### User Session
- **Active** → **Inactive**: After 30 minutes of inactivity or explicit session end
- **Inactive** → **Active**: When user starts new interaction (new session created)

### Selection Context
- **Active** → **Expired**: When expires_at timestamp is reached
- **Active** → **Cleared**: When user starts new selection or explicitly clears context