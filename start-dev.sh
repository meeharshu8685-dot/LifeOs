#!/bin/bash
echo "=== Starting Next.js Dev Server with Full Logging ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo ""
echo "=== Environment Variables ==="
cat .env.local | grep -v "KEY"
echo ""
echo "=== Starting Server ==="
npm run dev
