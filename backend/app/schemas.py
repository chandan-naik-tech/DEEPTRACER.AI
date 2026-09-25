from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_admin: bool
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class AnalysisSessionBase(BaseModel):
    path: str

class AnalysisSessionCreate(AnalysisSessionBase):
    pass

class AnalysisSession(AnalysisSessionBase):
    id: int
    status: str
    progress: float
    current_stage: str
    created_at: datetime
    class Config:
        from_attributes = True

class FileRecordBase(BaseModel):
    filename: str
    path: str
    extension: str
    size: int
    mime_type: Optional[str]
    file_hash: Optional[str]

class FileRecord(FileRecordBase):
    id: int
    session_id: int
    is_duplicate: bool
    is_corrupted: bool
    is_suspicious: bool
    is_threat: bool
    is_recoverable: bool
    created_time: datetime
    modified_time: datetime
    class Config:
        from_attributes = True

class ReportSummary(BaseModel):
    total_files: int
    total_size: int
    duplicates: int
    corrupted: int
    suspicious: int
    threats: int
    recoverable: int
    health_score: float
