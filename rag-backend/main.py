from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uuid
import logging
from datetime import datetime, timedelta
import secrets
from passlib.context import CryptContext
from jose import JWTError, jwt

from rag import RAGSystem
from db import get_db, create_tables
from models import ChatLog, ChatMetadata, User, Session, OnboardingProfile

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# JWT configuration
SECRET_KEY = "your-secret-key-change-in-production"  # Should be in environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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

# Password hashing context with bcrypt max_length parameter
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b", bcrypt__max_rounds=12)

# Authentication utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    # Ensure password is properly truncated to avoid bcrypt 72-byte limit
    if len(password) > 72:
        password = password[:72]
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_session_token(user_id: int) -> str:
    """Create a random session token"""
    return secrets.token_urlsafe(32)

def verify_token(token: str):
    """Verify JWT token and return user info"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Dependency to get current user from token
def get_current_user(token: str = None):
    if token is None:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            return None
        return user_id
    except JWTError:
        return None

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

from pydantic import field_validator

class UserCreate(BaseModel):
    email: str
    password: str

    @field_validator('password')
    @classmethod
    def validate_password_length(cls, v):
        if len(v) > 72:
            raise ValueError('Password must be 72 characters or less to comply with bcrypt limitations')
        return v

class UserLogin(BaseModel):
    email: str
    password: str

class OnboardingRequest(BaseModel):
    software_experience: str
    hardware_experience: str

@app.get("/")
def read_root():
    return {"message": "Hackathon Book RAG API is running!"}

# Authentication endpoints
@app.post("/auth/signup")
async def signup(user_data: UserCreate):
    """Create a new user account"""
    db = next(get_db())
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create new user
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            password_hash=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"user_id": new_user.id}, expires_delta=access_token_expires
        )

        return {
            "message": "User created successfully",
            "user_id": new_user.id,
            "email": new_user.email,
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.post("/auth/signin")
async def signin(user_data: UserLogin):
    """Sign in an existing user"""
    db = next(get_db())
    try:
        # Find user by email
        user = db.query(User).filter(User.email == user_data.email).first()
        if not user or not user.verify_password(user_data.password):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if not user.is_active:
            raise HTTPException(status_code=401, detail="Account is deactivated")

        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"user_id": user.id}, expires_delta=access_token_expires
        )

        return {
            "message": "Sign in successful",
            "user_id": user.id,
            "email": user.email,
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.post("/auth/onboarding")
async def onboarding(request: OnboardingRequest, token: str = None):
    """Save user onboarding information"""
    user_id = get_current_user(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    db = next(get_db())
    try:
        # Check if onboarding profile already exists for this user
        existing_profile = db.query(OnboardingProfile).filter(OnboardingProfile.user_id == user_id).first()

        if existing_profile:
            # Update existing profile
            existing_profile.software_experience = request.software_experience
            existing_profile.hardware_experience = request.hardware_experience
            db.commit()
            return {"message": "Onboarding profile updated successfully"}
        else:
            # Create new onboarding profile
            onboarding_profile = OnboardingProfile(
                user_id=user_id,
                software_experience=request.software_experience,
                hardware_experience=request.hardware_experience
            )
            db.add(onboarding_profile)
            db.commit()
            db.refresh(onboarding_profile)

            return {"message": "Onboarding profile created successfully", "profile_id": onboarding_profile.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/auth/profile")
async def get_profile(token: str = None):
    """Get user profile and onboarding information"""
    user_id = get_current_user(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    db = next(get_db())
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get onboarding profile
        onboarding_profile = db.query(OnboardingProfile).filter(OnboardingProfile.user_id == user_id).first()

        profile_data = {
            "user_id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "onboarding_profile": None
        }

        if onboarding_profile:
            profile_data["onboarding_profile"] = {
                "software_experience": onboarding_profile.software_experience,
                "hardware_experience": onboarding_profile.hardware_experience,
                "created_at": onboarding_profile.created_at
            }

        return profile_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.put("/auth/profile")
async def update_profile(request: OnboardingRequest, token: str = None):
    """Update user onboarding information"""
    user_id = get_current_user(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    db = next(get_db())
    try:
        # Check if onboarding profile already exists for this user
        existing_profile = db.query(OnboardingProfile).filter(OnboardingProfile.user_id == user_id).first()

        if existing_profile:
            # Update existing profile
            existing_profile.software_experience = request.software_experience
            existing_profile.hardware_experience = request.hardware_experience
            existing_profile.updated_at = datetime.utcnow()
            db.commit()
            return {"message": "Profile updated successfully"}
        else:
            # Create new onboarding profile
            onboarding_profile = OnboardingProfile(
                user_id=user_id,
                software_experience=request.software_experience,
                hardware_experience=request.hardware_experience
            )
            db.add(onboarding_profile)
            db.commit()
            db.refresh(onboarding_profile)

            return {"message": "Profile created successfully", "profile_id": onboarding_profile.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.post("/rag/query")
async def query_endpoint(request: QueryRequest, authorization: str = None):
    """
    General query endpoint that uses embeddings → Qdrant retrieval → grounded answer
    Stores logs in Neon database
    """
    # Extract token from authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

    user_id = get_current_user(token)

    try:
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())

        # Get user profile for personalization if user is authenticated
        user_profile = None
        if user_id:
            db = next(get_db())
            try:
                # Get onboarding profile for personalization
                onboarding_profile = db.query(OnboardingProfile).filter(OnboardingProfile.user_id == user_id).first()
                if onboarding_profile:
                    user_profile = {
                        "software_experience": onboarding_profile.software_experience,
                        "hardware_experience": onboarding_profile.hardware_experience
                    }
            except Exception as e:
                logger.error(f"Error fetching user profile: {str(e)}")
            finally:
                db.close()

        # Query the RAG system with user profile for personalization
        result = rag_system.query(request.query, user_profile=user_profile)

        # Store chat log in database
        db = next(get_db())
        try:
            # Convert source chunks to JSON string for storage
            import json
            source_chunks_json = json.dumps(result.get("source_chunks", []))

            chat_log = ChatLog(
                session_id=session_id,
                user_id=user_id,  # Store user_id if authenticated
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
async def selected_text_query_endpoint(request: SelectedTextQueryRequest, authorization: str = None):
    """
    Query endpoint that answers ONLY from the user-selected text
    No retrieval from Qdrant
    No outside knowledge
    """
    # Extract token from authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

    user_id = get_current_user(token)

    try:
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())

        # Get user profile for personalization if user is authenticated
        user_profile = None
        if user_id:
            db = next(get_db())
            try:
                # Get onboarding profile for personalization
                onboarding_profile = db.query(OnboardingProfile).filter(OnboardingProfile.user_id == user_id).first()
                if onboarding_profile:
                    user_profile = {
                        "software_experience": onboarding_profile.software_experience,
                        "hardware_experience": onboarding_profile.hardware_experience
                    }
            except Exception as e:
                logger.error(f"Error fetching user profile: {str(e)}")
            finally:
                db.close()

        # Answer using only the selected text with personalization
        answer = rag_system.answer_from_selected_text(request.query, request.selected_text, user_profile=user_profile)

        # Store chat log in database
        db = next(get_db())
        try:
            chat_log = ChatLog(
                session_id=session_id,
                user_id=user_id,  # Store user_id if authenticated
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