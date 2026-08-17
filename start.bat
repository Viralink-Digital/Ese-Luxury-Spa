@echo off
echo ========================================
echo   Ese Luxury Spa - Quick Start
echo ========================================
echo.

echo Killing any Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Starting Backend...
start "" cmd /k "cd /d D:\xampp\htdocs\ese-luxury-platform\backend && npm run dev"
timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "" cmd /k "cd /d D:\xampp\htdocs\ese-luxury-platform\frontend && npm run dev"

echo.
echo ========================================
echo   ✅ SERVERS STARTED
echo ========================================
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ========================================
echo.
pause