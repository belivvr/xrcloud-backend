#!/bin/sh
set -e

. $ENV

docker rm -f $TYPEORM_HOST

docker run --restart=always --name $TYPEORM_HOST -d --log-opt max-size=10m --log-opt max-file=3 \
    --network xrcloud \
    -p 5432:5432 \
    -e POSTGRES_DB=$TYPEORM_DATABASE \
    -e POSTGRES_USER=$TYPEORM_USERNAME \
    -e POSTGRES_PASSWORD=$TYPEORM_PASSWORD \
    -e POSTGRES_INITDB_ARGS=--encoding=UTF-8 \
    -v /data/postgres/xrcloud:/var/lib/postgresql/data \
    postgres:13.11

LOG_MSG="listening on IPv4 address \"0.0.0.0\", port 5432"

while ! docker logs "$TYPEORM_HOST" 2>&1 | grep -q "$LOG_MSG"; do
    sleep 1
done

docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "ALTER USER \"$TYPEORM_USERNAME\" WITH SUPERUSER;"
docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "GRANT ALL PRIVILEGES ON DATABASE \"$TYPEORM_DATABASE\" TO \"$TYPEORM_USERNAME\";"
docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "GRANT CREATE ON DATABASE \"$TYPEORM_DATABASE\" TO \"$TYPEORM_USERNAME\";"
docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "CREATE SCHEMA IF NOT EXISTS \"$TYPEORM_SCHEMA\";"
