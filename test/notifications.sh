#!/bin/bash
set -e
cd "$(dirname "$0")"

. ./@env-console.sh
. ./@config.sh
. ./login.sh

SCENE_ID='6529c500-38bf-4378-9bf6-dbe7b02d6330'
ROOM_ID='a1ee44f8-4dd9-4749-aa54-4ea9ec9dd2b6'

POST /notifications \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{
            "payload": "test"
        }'

POST "/notifications" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{
            "payload": "test_scene",
            "sceneId": "'$SCENE_ID'"
        }'

POST "/notifications" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{
            "payload": "test_room",
            "roomId": "'$ROOM_ID'"
        }'
