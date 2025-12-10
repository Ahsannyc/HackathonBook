from sqlalchemy import Column, Integer, String, Text, DateTime, create_engine, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from passlib.context import CryptContext
import os

Base = declarative_base()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.password_hash)

class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True)  # session_id
    user_id = Column(Integer, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class OnboardingProfile(Base):
    __tablename__ = "onboarding_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    software_experience = Column(String, nullable=True)  # e.g., "beginner", "intermediate", "advanced"
    hardware_experience = Column(String, nullable=True)  # e.g., "beginner", "intermediate", "advanced"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    user_id = Column(Integer, index=True)  # Add user_id to link chat logs to users
    query = Column(Text)
    response = Column(Text)
    source_chunks = Column(Text)  # JSON string of source chunks used
    timestamp = Column(DateTime, default=datetime.utcnow)

class ChatMetadata(Base):
    __tablename__ = "chat_metadata"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    user_id = Column(String, index=True)
    page_url = Column(String)
    metadata_info = Column(Text)  # JSON string of additional metadata (renamed to avoid SQLAlchemy conflict)
    timestamp = Column(DateTime, default=datetime.utcnow)