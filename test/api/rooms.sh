#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-api.sh
. ../@config.sh

# createRoom
POST /rooms \
    -H "x-xrcloud-api-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
            "projectId": "'$PROJECT_ID'",
            "sceneId": "'$SCENE_ID'",
            "name": "testName",
            "size": 9,
            "returnUrl": "https://naver.com"
        }'

ROOM_ID=$(echo $BODY | jq -r '.id')

# findRooms
GET "/rooms?sceneId=$SCENE_ID&userId=$USER_ID&$PAGE_OPT" \
    -H "x-xrcloud-api-key: $API_KEY"

# getRoom
GET "/rooms/$ROOM_ID?userId=$USER_ID" \
    -H "x-xrcloud-api-key: $API_KEY"

# updateRoom
PATCH /rooms/$ROOM_ID \
    -H "x-xrcloud-api-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
            "name": "Updated Test Room Name",
            "size": 5,
            "returnUrl": "https://naver.com"
        }'

# # removeRoom
# DELETE /rooms/$ROOM_ID \
#     -H "x-xrcloud-api-key: $API_KEY"
