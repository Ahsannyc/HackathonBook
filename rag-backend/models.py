from sqlalchemy import Column, Integer, String, Text, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

Base = declarative_base()

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
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