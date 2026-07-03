@echo off
echo ========================================
echo   Stopping Development Servers
echo ========================================
echo.

echo Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ All Node processes killed
) else (
    echo ℹ️  No Node processes found
)

echo.
echo ========================================
echo   ✅ SERVERS STOPPED
echo ========================================
echo.
pause