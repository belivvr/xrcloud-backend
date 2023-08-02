#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh

# createRoom
res=$(
    POST "/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms" \
        -H "Authorization: Bearer $PROJECT_KEY" \
        -H "Content-Type: application/json" \
        -d '{
                "personalId": "'$PERSONAL_ID'",
                "name": "testName"
            }'
)
id=$(echo $res | jq -r '.id')

# findRooms
res=$(
    GET "/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms?$PAGE_OPT" \
        -H "Authorization: Bearer $PROJECT_KEY"
)

# getRoom
res=$(
    GET "/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms/$id" \
        -H "Authorization: Bearer $PROJECT_KEY"
)

# updateRoom
res=$(
    PATCH "/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms/$id" \
        -H "Authorization: Bearer $PROJECT_KEY" \
        -H "Content-Type: application/json" \
        -d '{
                "personalId": "'$PERSONAL_ID'",
                "name": "updatedTestName"
            }'
)

# removeRoom
res=$(
    DELETE "/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms/$ROOM_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)
