#!/bin/bash

echo "========================================"
echo "  Restart Development Servers"
echo "========================================"
echo ""

echo "This will stop all servers and restart them fresh."
echo "Press Ctrl+C to cancel..."
sleep 3

./stop-dev.sh
sleep 3
./start-dev.sh