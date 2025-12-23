#!/bin/bash

echo "========================================"
echo "   ReviewHub - Quick Start Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi

echo "[1/4] Node.js found:"
node --version
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[2/4] Installing dependencies (this may take a few minutes)..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
else
    echo "[2/4] Dependencies already installed"
fi
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "[3/4] Setting up configuration..."
    echo "WARNING: No .env file found!"
    echo ""
    echo "Please run this command first:"
    echo "  npm run setup"
    echo ""
    echo "Or manually create a .env file from .env.example"
    echo ""
    exit 1
else
    echo "[3/4] Configuration file found"
fi
echo ""

echo "[4/4] Starting ReviewHub..."
echo ""
echo "========================================"
echo " ReviewHub is starting!"
echo " Open your browser to: http://localhost:3000"
echo " Press Ctrl+C to stop the server"
echo "========================================"
echo ""

# Start the server
node server.js
