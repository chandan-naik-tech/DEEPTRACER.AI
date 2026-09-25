@echo off
echo Starting DEEP TRACER AI...

echo Starting Backend API...
cd backend
start /b node server.js

echo Starting Frontend...
cd ../frontend
npm run dev
