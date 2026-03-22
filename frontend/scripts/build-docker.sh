#!/bin/bash
set -e

echo "Building Docker image for production..."

IMAGE_NAME="${DOCKER_IMAGE_NAME:-sprintfund-frontend}"
IMAGE_TAG="${DOCKER_IMAGE_TAG:-latest}"

docker build \
  --no-cache \
  --build-arg NODE_ENV=production \
  -t "${IMAGE_NAME}:${IMAGE_TAG}" \
  -f Dockerfile \
  .

echo "Build complete: ${IMAGE_NAME}:${IMAGE_TAG}"

if [ "$PUSH_IMAGE" = "true" ]; then
  echo "Pushing image to registry..."
  docker push "${IMAGE_NAME}:${IMAGE_TAG}"
  echo "Push complete"
fi
