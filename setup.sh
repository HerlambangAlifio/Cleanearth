#!/bin/bash

echo "===================================================="
echo "CleanEarth Setup Script"
echo "===================================================="
echo

echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed"

echo
echo "[2/5] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies!"
    exit 1
fi
echo "✓ Backend dependencies installed"

echo
echo "[3/5] Creating uploads directory..."
mkdir -p uploads
echo "✓ Uploads directory created"

echo
echo "[4/5] Setting up environment file..."
if [ ! -f ".env" ]; then
    cp env.example .env
    echo "✓ Environment file created from template"
    echo
    echo "IMPORTANT: Please edit .env file with your database credentials!"
else
    echo "✓ Environment file already exists"
fi

echo
echo "[5/5] Setup completed!"
echo
echo "Next steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Import database/cleanearth.sql to your MySQL database"
echo "3. Run: cd backend && npm start"
echo "4. Open Client/index.html in your browser"
echo
echo "====================================================" 