@echo off
echo ========================================
echo   Ese Luxury Spa - Simple Start
echo ========================================
echo.

echo Step 1: Killing Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Step 2: Starting Backend...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak >nul

echo Step 3: Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers Started
echo ========================================
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ========================================
echo.
pause