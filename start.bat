@echo off
echo ========================================
echo    ReviewHub - Quick Start Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/4] Node.js found: 
node --version
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [2/4] Installing dependencies (this may take a few minutes)...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [2/4] Dependencies already installed
)
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [3/4] Setting up configuration...
    echo WARNING: No .env file found!
    echo.
    echo Please run this command first:
    echo   npm run setup
    echo.
    echo Or manually create a .env file from .env.example
    echo.
    pause
    exit /b 1
) else (
    echo [3/4] Configuration file found
)
echo.

echo [4/4] Starting ReviewHub...
echo.
echo ========================================
echo  ReviewHub is starting!
echo  Open your browser to: http://localhost:3000
echo  Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start the server
node server.js
