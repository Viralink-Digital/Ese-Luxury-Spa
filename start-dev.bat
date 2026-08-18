@echo off
echo ========================================
echo   Ese Luxury Spa - Start Servers
echo ========================================
echo.

echo Starting Backend...
start cmd /k "cd /d D:\xampp\htdocs\ese-luxury-platform\backend && npm run dev"

echo Starting Frontend...
start cmd /k "cd /d D:\xampp\htdocs\ese-luxury-platform\frontend && npm run dev"

echo.
echo ========================================
echo   ✅ SERVERS STARTED
echo ========================================
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ========================================
echo.
echo To stop: Close the command windows
echo.
pause