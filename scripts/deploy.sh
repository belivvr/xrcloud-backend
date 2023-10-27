#!/bin/bash

i=${1:-latest}

#
cd ~/workspace/xrcloud-backend
git pull origin main || exit 1

#
cp ~/workspace/envs/.env ./.env || exit 1

#
docker stop backend || true
docker rm backend || true

#
docker build -t "backend-$i" . || exit 1

#
docker network create xrcloud || true

#
docker run --restart always -d \
    -e NODE_ENV=production \
    --name backend \
    --network xrcloud \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    -v ~/workspace/xrcloud-backend/.env:/app/.env \
    -v ~/workspace/logs/backend:/app/logs \
    "backend-$i" || exit 1

#
docker system prune -f || exit 1

#
echo "Docker container backend-$i is up and running."
