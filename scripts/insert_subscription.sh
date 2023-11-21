#!/bin/bash
set -e
cd "$(dirname "$0")"

source ../.env

email=$1

if [ -z "$email" ]; then
    echo "Error: No email address provided."
    exit 1
fi

export PGPASSWORD=$TYPEORM_PASSWORD

adminId=$(psql -h $TYPEORM_HOST -p $TYPEORM_PORT -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -t -c "SELECT id FROM \"$TYPEORM_SCHEMA\".admins WHERE email = '$email';" | awk '{$1=$1};1')

if [ -z "$adminId" ]; then
    echo "Error: User with email $email does not exist in the database."
    exit 1
fi

# Check validation
validation=$(psql -h $TYPEORM_HOST -p $TYPEORM_PORT -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -t -c \
"SELECT COUNT(*) FROM \"$TYPEORM_SCHEMA\".\"subscriptions\" WHERE \"adminId\" = '$adminId' AND \"endAt\" > now();" | xargs)

if [ "$validation" -gt "0" ]; then
    echo "Error: User with email $email already has a valid subscription."
    exit 1
fi

# Insert subscription
psql -h $TYPEORM_HOST -p $TYPEORM_PORT -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c \
"INSERT INTO \"$TYPEORM_SCHEMA\".\"subscriptions\" \
    (\"id\", \"createdAt\", \"updatedAt\", \"version\", \"status\", \"startAt\", \"endAt\", \"adminId\", \"tierId\") \
VALUES \
    (uuid_generate_v4(), now(), now(), 1, 'active', now(), now() + interval '1 year', '$adminId', 'b9287d85-6144-43e8-92b2-eaa1472f857b');"

echo "Subscription added for user with email $email."
