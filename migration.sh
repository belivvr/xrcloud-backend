#!/bin/bash
set -e
cd "$(dirname "$0")"

. $ENV
DOCKER_CONTAINER=$(basename "$PWD")
DOCKER_IMAGE="$DOCKER_CONTAINER:$(date +%s)"


# 도커 컨테이너 내에서 마이그레이션 실행
docker exec -it ${DOCKER_CONTAINER} sh -c "
  npx typeorm migration:generate -d ./dist/database/data-source.js ./src/database/migrations/\$1 &&
  npx typeorm migration:run -d ./dist/database/data-source.js
"