#!/bin/bash

# 이미지 버전을 입력 받습니다. 인자로 넘기지 않으면 기본값 'latest'를 사용합니다.
i=${1:-latest}

#
cd ~/workspace/xrcloud-backend || exit 1
git pull origin main || exit 1

#
cp ~/workspace/envs/.env ./.env || exit 1

#
docker stop backend || true
docker rm backend || true

#
docker build -t "backend-$i" . || exit 1

#
docker network create --subnet=172.18.0.0/16 xrcloud || true

#
docker run --restart always -d \
    -e NODE_ENV=production \
    --name backend \
    --network xrcloud \
    --log-opt max-size=10m \
    --log-opt max-file=10 \
    -v ~/workspace/xrcloud-backend/.env:/app/.env \
    -v ~/workspace/logs/backend:/app/logs \
    "backend-$i" || exit 1

#
docker system prune -f || exit 1

#
echo "Docker container backend-$i is up and running."
