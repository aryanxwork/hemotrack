@echo off
echo Starting HemoTrack Backend...
start cmd /k "cd hemotrack-backend && npm run dev"

echo Starting HemoTrack Frontend...
start cmd /k "npm run dev"

echo HemoTrack is starting up!
echo Frontend will be available at: http://localhost:5173/
echo Backend will be available at: http://localhost:5000/
