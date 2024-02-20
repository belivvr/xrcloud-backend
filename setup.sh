#!/bin/bash
set -e
cd "$(dirname "$0")"

. $ENV

if [ -n "$DB_VOLUME_DIR" ]; then
    sudo mkdir -p "$DB_VOLUME_DIR"

    sudo mount -t nfs $DB_NAS_LOCATION $DB_VOLUME_DIR

    echo "$DB_NAS_LOCATION $DB_VOLUME_DIR nfs, defaults 0 0" | sudo tee -a /etc/fstab
fi

docker_compose() {
    docker compose -f ./docker-compose.yml --env-file $ENV $@
}

docker_compose --profile infra down
docker_compose --profile infra up -d

LOG_MSG="database system is ready to accept connections"

while ! docker logs "$TYPEORM_HOST" 2>&1 | grep -q "$LOG_MSG"; do
    sleep 1
done

docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "ALTER USER \"$TYPEORM_USERNAME\" WITH SUPERUSER;"
docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "GRANT ALL PRIVILEGES ON DATABASE \"$TYPEORM_DATABASE\" TO \"$TYPEORM_USERNAME\";"
docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "GRANT CREATE ON DATABASE \"$TYPEORM_DATABASE\" TO \"$TYPEORM_USERNAME\";"
docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "CREATE SCHEMA \"$TYPEORM_SCHEMA\" AUTHORIZATION \"$TYPEORM_USERNAME\";"
docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "GRANT ALL ON SCHEMA \"$TYPEORM_SCHEMA\" TO \"$TYPEORM_USERNAME\" WITH GRANT OPTION;"
