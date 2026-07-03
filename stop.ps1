# Ese Luxury Spa - PowerShell Stop Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Stopping Development Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Stopping all Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ SERVERS STOPPED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")