#!/bin/bash
set -e

. "$(dirname "$0")"/../.env

EMAIL=$1

if [ -z "$EMAIL" ]; then
    EMAIL='cnu1@belivvr.si'
fi

insert_system_credentials() {
    SYSTEM_PASSWORD='$2b$10$qCVt9B1MYAcXMxrvbv2FfePSaxMM2GfyEb3TK6BiiQnpoNfumOLdK'

    query="INSERT INTO main.admins (email, name, password, version) VALUES ('$EMAIL', 'cnu', '$SYSTEM_PASSWORD', 1);"

    docker exec -it $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "$query"
}

insert_system_credentials
