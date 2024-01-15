#!/bin/bash
set -e
cd "$(dirname "$0")"

. $ENV

DOCKER_CONTAINER=$(basename "$PWD")

sudo mkdir -p -m 755 "/app/$DOCKER_CONTAINER/logs"

docker rm -f $CACHE_HOST

docker run --restart=always -d --log-opt max-size=10m --log-opt max-file=3 \
    --name $CACHE_HOST \
    --network xrcloud \
    redis:7.0 redis-server

docker rm -f $TYPEORM_HOST

sudo mkdir -p "$DB_VOLUME_DIR"

sudo mount -t nfs $DB_NAS_LOCATION $DB_VOLUME_DIR

echo "$DB_NAS_LOCATION $DB_VOLUME_DIR nfs, defaults 0 0" | sudo tee -a /etc/fstab

docker run --restart=always -d --log-opt max-size=10m --log-opt max-file=3 \
    --name $TYPEORM_HOST \
    --network xrcloud \
    -e POSTGRES_DB=$TYPEORM_DATABASE \
    -e POSTGRES_USER=$TYPEORM_USERNAME \
    -e POSTGRES_PASSWORD=$TYPEORM_PASSWORD \
    -e POSTGRES_INITDB_ARGS=--encoding=UTF-8 \
    -v "$DB_VOLUME_DIR":/var/lib/postgresql/data \
    postgres:13.11

LOG_MSG="database system is ready to accept connections"

while ! docker logs "$TYPEORM_HOST" 2>&1 | grep -q "$LOG_MSG"; do
    sleep 1
done

docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "ALTER USER \"$TYPEORM_USERNAME\" WITH SUPERUSER;"
docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "GRANT ALL PRIVILEGES ON DATABASE \"$TYPEORM_DATABASE\" TO \"$TYPEORM_USERNAME\";"
docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "GRANT CREATE ON DATABASE \"$TYPEORM_DATABASE\" TO \"$TYPEORM_USERNAME\";"

. ./scripts/insert_tiers.sh
