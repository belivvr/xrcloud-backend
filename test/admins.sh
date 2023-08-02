#!/bin/bash
cd "$(dirname "$0")"

#
. ./@config.sh

# create
res=$(
    POST /admins \
        -H "Content-Type: application/json" \
        -d '{
                "email": "zizi2717@belivvr.com",
                "password": "123123"
            }'
)

# scenes: create
res=$(
    GET /admins/scenes/new \
        -H "Authorization: Bearer $PROJECT_KEY" \
        -H "X-Xrcloud-Project-Id: $PROJECT_ID"
)

# scenes: update
res=$(
    GET "/admins/scenes/modify?sceneId=$SCENE_ID" \
        -H "Authorization: Bearer $PROJECT_KEY" \
        -H "X-Xrcloud-Project-Id: $PROJECT_ID"
)

# rooms: create
res=$(
    POST /admins/rooms \
        -H "Authorization: Bearer $PROJECT_KEY" \
        -H "X-Xrcloud-Project-Id: $PROJECT_ID" \
        -H 'Content-Type: application/json' \
        -d '{
                "sceneId": "'$SCENE_ID'",
                "name": "testRoomName",
                "size": 20
            }'
)

# rooms: update
res=$(
    PATCH /admins/rooms/$ROOM_ID \
        -H "Authorization: Bearer $PROJECT_KEY" \
        -H "X-Xrcloud-Project-Id: $PROJECT_ID" \
        -H 'Content-Type: application/json' \
        -d '{
                "name": "testRoomName",
                "size": 20
            }'
)
