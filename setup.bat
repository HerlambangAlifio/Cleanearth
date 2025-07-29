@echo off
echo ====================================================
echo CleanEarth Setup Script
echo ====================================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/5] Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed

echo.
echo [3/5] Creating uploads directory...
if not exist "uploads" mkdir uploads
echo ✓ Uploads directory created

echo.
echo [4/5] Setting up environment file...
if not exist ".env" (
    copy "env.example" ".env"
    echo ✓ Environment file created from template
    echo.
    echo IMPORTANT: Please edit .env file with your database credentials!
) else (
    echo ✓ Environment file already exists
)

echo.
echo [5/5] Setup completed!
echo.
echo Next steps:
echo 1. Edit backend/.env with your database credentials
echo 2. Import database/cleanearth.sql to your MySQL database
echo 3. Run: cd backend && npm start
echo 4. Open Client/index.html in your browser
echo.
echo ====================================================
pause 