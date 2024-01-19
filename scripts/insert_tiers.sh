#!/bin/bash
set -e
cd "$(dirname "$0")"

. $ENV

PSQL() {
    docker exec -it $TYPEORM_HOST psql -U $TYPEORM_USERNAME -d $TYPEORM_DATABASE -c "$1"
}

# Insert starter tier
QUERY="INSERT INTO \"$TYPEORM_SCHEMA\".\"tiers\" \
    (\"id\", \"createdAt\", \"updatedAt\", \"version\", \"name\", \"description\", \"currency\", \"price\", \"maxStorage\", \"maxRooms\", \"maxRoomSize\", \"isDefault\") \
VALUES \
    ('cc68afcb-f0db-4537-9746-aa462862c703', '2023-09-14 07:27:24.577255', '2023-09-14 07:27:24.577255', 1, 'starter', 'temp desctipion', 'KRW', '0', '500MB', 1, 10, 'true');"

PSQL "$QUERY"

# Insert personal tier
QUERY="INSERT INTO \"$TYPEORM_SCHEMA\".\"tiers\" \
    (\"id\", \"createdAt\", \"updatedAt\", \"version\", \"name\", \"description\", \"currency\", \"price\", \"maxStorage\", \"maxRooms\", \"maxRoomSize\", \"isDefault\") \
VALUES \
    ('43725885-17d7-41a1-a9f2-42dd7c465701', '2023-09-14 07:28:24.577255', '2023-09-14 07:28:24.577255', 1, 'personal', 'temp desctipion', 'KRW', '8800', '2GB', 5, 25, 'false');"

PSQL "$QUERY"

# Insert professional tier
QUERY="INSERT INTO \"$TYPEORM_SCHEMA\".\"tiers\" \
    (\"id\", \"createdAt\", \"updatedAt\", \"version\", \"name\", \"description\", \"currency\", \"price\", \"maxStorage\", \"maxRooms\", \"maxRoomSize\", \"isDefault\") \
VALUES \
    ('b9287d85-6144-43e8-92b2-eaa1472f857b', '2023-09-14 07:29:24.577255', '2023-09-14 07:29:24.577255', 1, 'professional', 'temp desctipion', 'KRW', '99000', '25GB', 999999, 1000, 'false');"

PSQL "$QUERY"
