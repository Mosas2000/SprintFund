#!/bin/bash
set -e

echo "Checking deployment readiness..."
echo ""

READY=true

if [ ! -f "package.json" ]; then
  echo "ERROR: package.json not found"
  READY=false
fi

if [ ! -f "next.config.ts" ]; then
  echo "ERROR: next.config.ts not found"
  READY=false
fi

if [ ! -f "vercel.json" ]; then
  echo "ERROR: vercel.json not found"
  READY=false
fi

if [ ! -d "src/app" ]; then
  echo "ERROR: src/app directory not found"
  READY=false
fi

if command -v npm &> /dev/null; then
  echo "OK: npm is installed"
else
  echo "ERROR: npm is not installed"
  READY=false
fi

if [ -f "package-lock.json" ]; then
  echo "OK: package-lock.json exists"
else
  echo "WARN: package-lock.json missing, run npm install"
fi

echo ""
if [ "$READY" = true ]; then
  echo "Deployment readiness check passed"
  echo ""
  echo "Next steps:"
  echo "1. Set environment variables"
  echo "2. Run ./scripts/validate-deploy.sh"
  echo "3. Test build: npm run build"
  echo "4. Deploy using your platform of choice"
  exit 0
else
  echo "Deployment readiness check failed"
  exit 1
fi
