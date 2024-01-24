#!/bin/bash
set -ex
cd "$(dirname "$0")"

. $ENV

email=$1

if [ -z "$email" ]; then
    echo "Error: No email address provided."
    exit 1
fi

export PGPASSWORD=$TYPEORM_PASSWORD

PSQL() {
    docker exec $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "$1"
}

QUERY="SELECT id FROM \"$TYPEORM_SCHEMA\".\"admins\" WHERE email='$email';"
adminId=$(PSQL "$QUERY" | sed -n 3p | tr -d ' ')

QUERY="SELECT EXISTS(SELECT 1 FROM \"$TYPEORM_SCHEMA\".\"subscriptions\" WHERE \"adminId\"='$adminId');"
subscriptionExists=$(PSQL "$QUERY" | sed -n 3p | tr -d ' ')

if [ "$subscriptionExists" = "t" ]; then
    QUERY="UPDATE \"$TYPEORM_SCHEMA\".\"subscriptions\" \
        SET \"tierId\"='b9287d85-6144-43e8-92b2-eaa1472f857b' \
        WHERE \"adminId\" = '$adminId';"

    PSQL "$QUERY"
else
    QUERY="INSERT INTO \"$TYPEORM_SCHEMA\".\"subscriptions\" \
        (\"id\", \"createdAt\", \"updatedAt\", \"version\", \"status\", \"startAt\", \"endAt\", \"adminId\", \"tierId\") \
        VALUES (uuid_generate_v4(), now(), now(), 1, 'active', now(), now() + interval '1 year', '$adminId', 'b9287d85-6144-43e8-92b2-eaa1472f857b');"

    PSQL "$QUERY"
fi
