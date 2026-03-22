#!/bin/bash
set -e

PORT="${PORT:-3000}"
HOSTNAME="${HOSTNAME:-0.0.0.0}"

if [ ! -d ".next" ]; then
  echo "Building application..."
  npm run build
fi

echo "Starting production server on ${HOSTNAME}:${PORT}..."
exec npm run start -- -H "$HOSTNAME" -p "$PORT"
