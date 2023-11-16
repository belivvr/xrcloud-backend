#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-console.sh
. ./@config.sh
. ./login.sh

# joinRoom
POST /events/hub \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
            "type": "room-join",
            "sessionId": "e8318120-e2e7-4732-9452-b098de83d30c",
            "eventTime": "2023-08-29 05:10:20.149315",
            "roomId": "3s3Z6iJ",
            "userId": "1561561531351"
        }'

# exitRoom
POST /events/hub \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
            "type": "room-exit",
            "sessionId": "e8318120-e2e7-4732-9452-b098de83d30c",
            "eventTime": "2023-08-29 05:15:20.149315"
        }'

# findRoomAccess
GET "/api/rooms/$ROOM_ID/logs?userId=$USER_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN"
