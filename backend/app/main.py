from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, database
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="DEEP TRACER AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "DEEP TRACER AI Backend is running"}

@app.post("/api/auth/login")
def login():
    # Placeholder for auth
    return {"access_token": "mock-token", "token_type": "bearer"}

@app.post("/api/analysis/start", response_model=schemas.AnalysisSession)
def start_analysis(session_in: schemas.AnalysisSessionCreate, db: Session = Depends(database.get_db)):
    # Start analysis logic here
    db_session = models.AnalysisSession(path=session_in.path, status="running", current_stage="Raw Data")
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@app.get("/api/analysis/{session_id}", response_model=schemas.AnalysisSession)
def get_analysis_status(session_id: int, db: Session = Depends(database.get_db)):
    session = db.query(models.AnalysisSession).filter(models.AnalysisSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
