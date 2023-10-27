#!/bin/sh
set -ex

cd "$(dirname "$0")"
THISDIR=$(pwd)
cd ..
. ./env.sh
cd $THISDIR

docker rm -f postgres

if [ "$1" = "prod" ]; then
    sudo mkdir -p "$DB_VOLUME_DIR"

    #마운트 실행
    sudo mount -t nfs $DB_NAS_LOCATION $DB_VOLUME_DIR

    #마운트 정보 유지 설정(fstab 설정)
    echo "$DB_NAS_LOCATION $DB_VOLUME_DIR nfs, defaults 0 0" | sudo tee -a /etc/fstab

    docker run --log-opt max-size=10m --log-opt max-file=3 -d --restart=always -p 5432:5432 --name db -d -e POSTGRES_PASSWORD="$DB_PASSWORD" -v "$DB_VOLUME_DIR":/var/lib/postgresql/data postgres:11-bullseye || true
    sleep 5
else
    docker run --log-opt max-size=10m --log-opt max-file=3 -d --restart=always -p 5432:5432 --name db -d -e POSTGRES_PASSWORD="$DB_PASSWORD" postgres:11-bullseye || true
fi

container_name="postgres"
log_message="listening on IPv4 address \"0.0.0.0\", port 5432"

while ! docker logs "$container_name" 2>&1 | grep -q "$log_message"; do
    sleep 1
done

docker exec postgres psql -U $TYPEORM_USERNAME -c "CREATE DATABASE ret_dev;"
docker exec postgres psql -U $TYPEORM_USERNAME -d ret_dev -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
docker exec postgres psql -U $TYPEORM_USERNAME -d ret_dev -c "ALTER USER $DB_USER WITH SUPERUSER;"
docker exec postgres psql -U $TYPEORM_USERNAME -d ret_dev -c "GRANT ALL PRIVILEGES ON DATABASE ret_dev TO $DB_USER;"
docker exec postgres psql -U $TYPEORM_USERNAME -d ret_dev -c "GRANT CREATE ON DATABASE ret_dev TO $DB_USER;"
