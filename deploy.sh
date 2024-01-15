#!/bin/bash
set -e
cd "$(dirname "$0")"

. $ENV

DOCKER_CONTAINER=$(basename "$PWD")
DOCKER_IMAGE="$DOCKER_CONTAINER:$(date +%s)"
LOGS_DIR="/app/$DOCKER_CONTAINER/logs"

docker build -t "$DOCKER_IMAGE" .

docker rm -f "$DOCKER_CONTAINER"

docker run --restart=always -d --log-opt max-size=10m --log-opt max-file=3 \
    --name $DOCKER_CONTAINER \
    --network xrcloud \
    -e NODE_ENV=production \
    -v "$ENV":/app/.env \
    -v "$LOGS_DIR":/app/logs \
    "$DOCKER_IMAGE"