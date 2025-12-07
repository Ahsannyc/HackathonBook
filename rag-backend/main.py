from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uuid
import logging
from datetime import datetime

from rag import RAGSystem
from db import get_db, create_tables
from models import ChatLog, ChatMetadata

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Hackathon Book RAG API",
    description="Retrieval-Augmented Generation API for the Hackathon Book",
    version="1.0.0"
)

# Add CORS middleware to allow requests from the Docusaurus frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system
rag_system = RAGSystem()

# Create database tables
create_tables()

# Request models
class QueryRequest(BaseModel):
    query: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None

class SelectedTextQueryRequest(BaseModel):
    query: str
    selected_text: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Hackathon Book RAG API is running!"}

@app.post("/rag/query")
async def query_endpoint(request: QueryRequest):
    """
    General query endpoint that uses embeddings → Qdrant retrieval → grounded answer
    Stores logs in Neon database
    """
    try:
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())

        # Query the RAG system
        result = rag_system.query(request.query)

        # Store chat log in database
        db = next(get_db())
        try:
            # Convert source chunks to JSON string for storage
            import json
            source_chunks_json = json.dumps(result.get("source_chunks", []))

            chat_log = ChatLog(
                session_id=session_id,
                query=request.query,
                response=result.get("answer", ""),
                source_chunks=source_chunks_json,
                timestamp=datetime.utcnow()
            )
            db.add(chat_log)
            db.commit()
        except Exception as e:
            logger.error(f"Error storing chat log: {str(e)}")
        finally:
            db.close()

        return {
            "answer": result.get("answer", ""),
            "source_chunks": result.get("source_chunks", []),
            "session_id": session_id
        }
    except Exception as e:
        logger.error(f"Error in query endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag/selected_text_query")
async def selected_text_query_endpoint(request: SelectedTextQueryRequest):
    """
    Query endpoint that answers ONLY from the user-selected text
    No retrieval from Qdrant
    No outside knowledge
    """
    try:
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())

        # Answer using only the selected text
        answer = rag_system.answer_from_selected_text(request.query, request.selected_text)

        # Store chat log in database
        db = next(get_db())
        try:
            chat_log = ChatLog(
                session_id=session_id,
                query=request.query,
                response=answer,
                source_chunks='[]',  # No source chunks for selected text queries
                timestamp=datetime.utcnow()
            )
            db.add(chat_log)
            db.commit()
        except Exception as e:
            logger.error(f"Error storing chat log: {str(e)}")
        finally:
            db.close()

        return {
            "answer": answer,
            "session_id": session_id
        }
    except Exception as e:
        logger.error(f"Error in selected text query endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)