@echo off
echo ========================================
echo   Restart Development Servers
echo ========================================
echo.

echo This will stop all servers and restart them fresh.
echo Press Ctrl+C to cancel...
timeout /t 3 /nobreak >nul

call stop-dev.bat
timeout /t 2 /nobreak >nul
call start-dev.bat