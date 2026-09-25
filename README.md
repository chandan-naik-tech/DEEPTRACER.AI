# DEEP TRACER AI

**"Trace. Understand. Recover. Protect."**

DEEP TRACER AI is an AI-assisted intelligent data analysis, recovery, integrity assessment, and digital-forensics platform prototype. 

This project contains two main parts:
- **frontend/**: A React + Vite application containing the forensic dashboard, pipeline visualization, and Hackathon Demo Mode.
- **backend/**: A FastAPI + SQLAlchemy server that powers the analysis sessions (includes Python `venv`).

## How to Run

### Quick Start (Windows)
Simply double-click the **`start.bat`** file in this directory. 
It will automatically open two terminal windows:
1. One to start the Backend API at `http://localhost:8000`
2. One to start the Frontend App at `http://localhost:5173`

*(Note: The frontend window might take a few seconds to install dependencies and start up)*

### Manual Startup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Run the server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Hackathon Demo Mode
Because browsers cannot safely access raw file systems for forensic analysis directly, we have built a **HACKATHON DEMO MODE**. 

1. Launch the application and go to `http://localhost:5173`
2. Login as a user or admin.
3. On the Dashboard, click **HACKATHON DEMO MODE** to simulate an analysis pipeline over a demo dataset and view the generated reports, classifications, and charts.
