#!/bin/bash

#
. ./@env-api.sh
. ../@config.sh

# createRoom
POST /api/rooms \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
            "projectId": "'$PROJECT_ID'",
            "sceneId": "'$SCENE_ID'",
            "name": "testName"
        }'
ROOM_ID=$(echo $BODY | jq -r '.id')

# findRooms
GET /api/rooms?sceneId=$SCENE_ID&userId=$USER_ID&$PAGE_OPT \
    -H "Authorization: Bearer $API_KEY"

# getRoom
GET /api/rooms/$ROOM_ID?userId=$USER_ID \
    -H "Authorization: Bearer $API_KEY"

# updateRoom
PATCH /api/rooms/$ROOM_ID \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
            "name": "Updated Test Room Name",
            "size": 5
        }'

# removeRoom
DELETE /api/rooms/$ROOM_ID \
    -H "Authorization: Bearer $API_KEY"
