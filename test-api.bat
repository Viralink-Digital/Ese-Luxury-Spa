@echo off
echo Testing Backend API...
echo.

echo Testing products endpoint:
curl http://localhost:5000/api/v1/products

echo.
echo.
echo Testing serum category:
curl http://localhost:5000/api/v1/products?category=serum

echo.
echo.
pause