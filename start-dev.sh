#!/bin/bash

echo "========================================"
echo "  Ese Luxury Spa - Robust Dev Setup"
echo "========================================"
echo ""

# Check system requirements
echo "[1/6] Checking System Requirements..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✅ Node.js found"

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. MySQL database may not work"
else
    echo "✅ Docker found"
fi

echo ""
echo "[2/6] Checking Docker MySQL Container..."
if ! docker ps | grep -q "ese_luxury_mysql"; then
    echo "❌ MySQL container not running. Starting it..."
    docker-compose up -d mysql
    sleep 5
else
    echo "✅ MySQL container running"
fi

echo ""
echo "[3/6] Aggressively Clearing All Ports..."
echo "  Killing any Node processes..."
pkill -9 node 2>/dev/null || true
sleep 2
echo "✅ Ports cleared"

echo ""
echo "[4/6] Validating Environment Configuration..."
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env not found. Copying from .env.example..."
    cp backend/.env.example backend/.env
else
    echo "✅ Backend .env exists"
fi

if [ ! -f "frontend/.env" ]; then
    echo "❌ frontend/.env not found. Creating it..."
    echo "VITE_API_URL=http://localhost:5000/api/v1" > frontend/.env
else
    echo "✅ Frontend .env exists"
fi

echo ""
echo "[5/6] Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..
sleep 6
echo "✅ Backend started (PID: $BACKEND_PID)"

echo ""
echo "[6/6] Starting Frontend Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..
sleep 4
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "========================================"
echo "  ✅ DEVELOPMENT ENVIRONMENT READY"
echo "========================================"
echo ""
echo "  🌐 Frontend: http://localhost:5173"
echo "  🔧 Backend:  http://localhost:5000"
echo "  🗄️  Database: MySQL on Docker (port 3307)"
echo ""
echo "  Admin Credentials:"
echo "  Email: saviourbravo@gmail.com"
echo "  Password: Great gamer23"
echo ""
echo "  To stop servers: ./stop-dev.sh"
echo "  To restart: ./restart-dev.sh"
echo ""
echo "  Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "Servers stopped."
    exit 0
}

# Trap signals for cleanup
trap cleanup INT TERM

# Wait for processes
wait