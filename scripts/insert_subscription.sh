#!/bin/bash
set -e
cd "$(dirname "$0")"

. $ENV

email=$1

if [ -z "$email" ]; then
    echo "Error: No email address provided."
    exit 1
fi

export PGPASSWORD=$TYPEORM_PASSWORD

PSQL() {
    docker exec -it $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "$1"
}

# Insert starter tier
QUERY="INSERT INTO \"$TYPEORM_SCHEMA\".\"subscriptions\" \
    (\"id\", \"createdAt\", \"updatedAt\", \"version\", \"status\", \"startAt\", \"endAt\", \"adminId\", \"tierId\") \
VALUES \
    (uuid_generate_v4(), now(), now(), 1, 'active', now(), now() + interval '1 year', '$adminId', 'b9287d85-6144-43e8-92b2-eaa1472f857b');"

PSQL "$QUERY"