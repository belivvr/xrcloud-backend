#!/bin/sh

HOME_DIR="/home/workspace"
PROJECT_DIR=$(dirname $(dirname $(realpath $0)))
PROJECT_NAME=$(basename "$PROJECT_DIR")
ENV_FILE="$PROJECT_DIR/.env"

. $ENV_FILE

# sudo apt-get install nfs-common

docker rm -f postgres

if [ "$ENV" = "prod" ]; then
    sudo mkdir -p "$DB_VOLUME_DIR"

    sudo mount -t nfs $DB_NAS_LOCATION $DB_VOLUME_DIR

    echo "$DB_NAS_LOCATION $DB_VOLUME_DIR nfs, defaults 0 0" | sudo tee -a /etc/fstab

    docker run --restart always --name postgres -d \
        --log-opt max-size=10m \
        --log-opt max-file=3 \
        -e POSTGRES_DB=$TYPEORM_DATABASE \
        -e POSTGRES_USER=$TYPEORM_USERNAME \
        -e POSTGRES_PASSWORD=$TYPEORM_PASSWORD \
        -e POSTGRES_INITDB_ARGS=--encoding=UTF-8 \
        -v /data/postgres/db-data:/var/lib/postgresql/data \
        --network xrcloud \
        postgres:13.11

    sleep 5
else
    docker run --restart always --name postgres -d \
        --log-opt max-size=10m \
        --log-opt max-file=3 \
        -e POSTGRES_DB=$TYPEORM_DATABASE \
        -e POSTGRES_USER=$TYPEORM_USERNAME \
        -e POSTGRES_PASSWORD=$TYPEORM_PASSWORD \
        -e POSTGRES_INITDB_ARGS=--encoding=UTF-8 \
        -v /data/postgres/db-data:/var/lib/postgresql/data \
        --network xrcloud \
        postgres:13.11
fi

container_name="postgres"
log_message="listening on IPv4 address \"0.0.0.0\", port 5432"

while ! docker logs "$container_name" 2>&1 | grep -q "$log_message"; do
    sleep 1
done

docker exec postgres psql -U $TYPEORM_USERNAME -c "CREATE DATABASE $TYPEORM_DATABASE;"
docker exec postgres psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "CREATE USER $TYPEORM_USERNAME WITH PASSWORD '$TYPEORM_PASSWORD';"
docker exec postgres psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "ALTER USER $TYPEORM_USERNAME WITH SUPERUSER;"
docker exec postgres psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "GRANT ALL PRIVILEGES ON DATABASE $TYPEORM_DATABASE TO $TYPEORM_USERNAME;"
docker exec postgres psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "GRANT CREATE ON DATABASE $TYPEORM_DATABASE TO $TYPEORM_USERNAME;"
