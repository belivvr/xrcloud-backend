#!/bin/bash
set -e

ENV=$1

if [ ! -f $ENV ]; then
    echo "Error: $ENV does not exist."
    exit 1
fi

SCRIPT_DIR=$(dirname "$(realpath "$0")")

docker rm -f cron || true

DOCKER_FILE="$SCRIPT_DIR/../cron/Dockerfile.$ENV"

if [ ! -f $DOCKER_FILE ]; then
    echo "Error: $DOCKER_FILE does not exist."
    exit 1
fi

DOCKER_CONTAINER='cron'
DOCKER_IMAGE="$DOCKER_CONTAINER:$(date +%s)"

docker build -t $DOCKER_IMAGE -f $DOCKER_FILE "$SCRIPT_DIR/../cron"

docker network create xrcloud || true

docker run --restart always -d --log-opt max-size=10m --log-opt max-file=3 \
    --name $DOCKER_CONTAINER \
    --network xrcloud \
    -v $SCRIPT_DIR/../cron/.env:/app/.env \
    $DOCKER_IMAGE
