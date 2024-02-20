#!/bin/sh
set -e

docker rm -f xrcloud-redis-vscode

docker run --restart=always -d --log-opt max-size=10m --log-opt max-file=3 \
    --name xrcloud-redis-vscode \
    --network vscode \
    redis:7.0 redis-server

docker rm -f xrcloud-postgres-vscode

docker run -d --restart=always --log-opt max-size=10m --log-opt max-file=3 \
    --name xrcloud-postgres-vscode \
    --network vscode \
    -p 5632:5432 \
    -e POSTGRES_DB=xrcloud-dev \
    -e POSTGRES_USER=xrcloud-dev \
    -e POSTGRES_PASSWORD=xrcloud-dev \
    -e POSTGRES_INITDB_ARGS=--encoding=UTF-8 \
    postgres:13.11

while ! docker exec xrcloud-postgres-vscode pg_isready -h xrcloud-postgres-vscode -U xrcloud; do
    sleep 1
    echo "Waiting..."
done

run_psql() {
    docker exec -e PGPASSWORD=xrcloud-dev -i xrcloud-postgres-vscode psql -h xrcloud-postgres-vscode -U xrcloud-dev -w "$@"
}

run_psql -d "xrcloud-dev" -c "ALTER DATABASE \"xrcloud-dev\" OWNER TO \"xrcloud-dev\";"
run_psql -d "xrcloud-dev" -c "GRANT ALL PRIVILEGES ON DATABASE \"xrcloud-dev\" TO \"xrcloud-dev\";"
run_psql -d "xrcloud-dev" -c "CREATE SCHEMA \"main\" AUTHORIZATION \"xrcloud-dev\";"
run_psql -d "xrcloud-dev" -c "GRANT ALL ON SCHEMA \"main\" TO \"xrcloud-dev\" WITH GRANT OPTION;"
