@echo off
echo Starting CleanEarth Backend Server...
echo.
cd backend
echo Installing dependencies...
npm install
echo.
echo Starting server on port 5000...
npm start
pause 