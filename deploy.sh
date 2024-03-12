#!/bin/bash
set -e
cd "$(dirname "$0")"

. $ENV

DOCKER_CONTAINER=$(basename "$PWD")
DOCKER_IMAGE="$DOCKER_CONTAINER:$(date +%s)"
LOGS_DIR="/app/$DOCKER_CONTAINER/logs"
STORAGE_DIR="/app/$DOCKER_CONTAINER/storage"

docker network create xrcloud || true

docker_compose() {
    export ENV DOCKER_CONTAINER DOCKER_IMAGE LOGS_DIR STORAGE_DIR
    docker compose -f ./docker-compose.yml --env-file $ENV $@
}

docker_compose --profile service down
docker_compose --profile service up -d --build
