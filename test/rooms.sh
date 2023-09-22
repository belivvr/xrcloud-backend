#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-console.sh
. ./@config.sh
. ./login.sh

# createRoom
POST /console/rooms \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
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
GET "/console/rooms?sceneId=$SCENE_ID&$PAGE_OPT" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getRoom
GET /console/rooms/$ROOM_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getOption
GET /console/rooms/option/$ROOM_ID?type=public
# GET /console/rooms/option/$OPTION_ID?type=public

# updateRoom
PATCH /console/rooms/$ROOM_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
            "name": "Updated Test Room Name",
            "size": 5,
            "returnUrl": "https://naver.com"
        }'

# removeRoom
DELETE /console/rooms/$ROOM_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN"
