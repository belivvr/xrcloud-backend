#!/bin/bash

#
HOME_DIR="/home/jdm/workspace"
PROJECT_DIR=$(dirname $(dirname $(realpath $0)))
PROJECT_NAME=$(basename "$PROJECT_DIR")
ENV_FILE="$PROJECT_DIR/.env"
LOGS_DIR="$HOME_DIR/logs/$PROJECT_NAME"

#
get_latest_tag() {
    local TAG=$(docker images | grep "$PROJECT_NAME" | awk '{print $2}' | grep -E '^[0-9]+$' | sort -r | head -n 1)
    echo ${TAG:-0}
}

LATEST_TAG=$(get_latest_tag)
NEW_TAG=$((LATEST_TAG + 1))

# check env
if [[ ! -f "$ENV_FILE" ]]; then
    echo "Environment file not found: $ENV_FILE"
    exit 1
fi

mkdir -p "$LOGS_DIR"

# move to project dir
cd "$PROJECT_DIR" || exit 1
echo "Working directory changed to $(pwd)"

# pull & build
git pull origin gs || exit 1

docker build -t "$PROJECT_NAME:$NEW_TAG" . || exit 1

# rm prev container
docker stop "$PROJECT_NAME" || true
docker rm "$PROJECT_NAME" || true

docker network create xrcloud || true

# run next container
docker run --restart always -d \
    -e NODE_ENV=production \
    --name $PROJECT_NAME \
    --network xrcloud \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    -v "$ENV_FILE":/app/.env \
    -v "$LOGS_DIR":/app/logs \
    "$PROJECT_NAME:$NEW_TAG" || exit 1

docker system prune -f || true

echo "Docker container $PROJECT_NAME is up and running."
