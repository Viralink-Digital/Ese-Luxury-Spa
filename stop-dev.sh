#!/bin/bash

echo "========================================"
echo "  Stopping Development Servers"
echo "========================================"
echo ""

echo "[1/2] Killing All Node Processes..."
pkill -9 node 2>/dev/null
if [ $? -eq 0 ]; then
    echo "  ✅ Killed all Node processes"
else
    echo "  ℹ️  No Node processes found"
fi

echo ""
echo "[2/2] Port Cleanup Complete..."
echo "✅ All development servers stopped"
echo ""