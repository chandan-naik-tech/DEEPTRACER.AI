from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    
class AnalysisSession(Base):
    __tablename__ = "analysis_sessions"
    id = Column(Integer, primary_key=True, index=True)
    path = Column(String)
    status = Column(String, default="running") # running, completed, failed
    progress = Column(Float, default=0.0)
    current_stage = Column(String, default="Raw Data")
    created_at = Column(DateTime, default=datetime.utcnow)
    files = relationship("FileRecord", back_populates="session")

class FileRecord(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("analysis_sessions.id"))
    filename = Column(String)
    path = Column(String)
    extension = Column(String)
    size = Column(Integer)
    created_time = Column(DateTime, default=datetime.utcnow)
    modified_time = Column(DateTime, default=datetime.utcnow)
    mime_type = Column(String)
    file_hash = Column(String) # sha256
    is_duplicate = Column(Boolean, default=False)
    duplicate_group_id = Column(Integer, nullable=True)
    is_corrupted = Column(Boolean, default=False)
    is_suspicious = Column(Boolean, default=False)
    is_threat = Column(Boolean, default=False)
    is_recoverable = Column(Boolean, default=False)
    
    session = relationship("AnalysisSession", back_populates="files")
    fragments = relationship("Fragment", back_populates="file_record")
    ai_classification = relationship("AIClassification", back_populates="file_record", uselist=False)
    integrity = relationship("IntegrityResult", back_populates="file_record", uselist=False)
    evidence_priority = relationship("EvidencePriority", back_populates="file_record", uselist=False)

class Fragment(Base):
    __tablename__ = "fragments"
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("files.id"))
    offset = Column(Integer)
    size = Column(Integer)
    estimated_completeness = Column(Float)
    file_record = relationship("FileRecord", back_populates="fragments")

class IntegrityResult(Base):
    __tablename__ = "integrity_results"
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("files.id"))
    score = Column(Float)
    reasons = Column(Text) # JSON string
    file_record = relationship("FileRecord", back_populates="integrity")

class AIClassification(Base):
    __tablename__ = "ai_classifications"
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("files.id"))
    category = Column(String) # Normal, Suspicious, etc.
    confidence = Column(Float)
    reasons = Column(Text) # JSON string
    file_record = relationship("FileRecord", back_populates="ai_classification")

class EvidencePriority(Base):
    __tablename__ = "evidence_priorities"
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("files.id"))
    priority = Column(String) # HIGH, MEDIUM, LOW
    reasons = Column(Text) # JSON string
    file_record = relationship("FileRecord", back_populates="evidence_priority")

class QuarantineItem(Base):
    __tablename__ = "quarantine_items"
    id = Column(Integer, primary_key=True, index=True)
    original_path = Column(String)
    quarantine_path = Column(String)
    file_hash = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    reason = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    original_classification = Column(String)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    username = Column(String)
    action = Column(String)
    path = Column(String, nullable=True)
    status = Column(String)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("analysis_sessions.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    content = Column(Text) # JSON summary
