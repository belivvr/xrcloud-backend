#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh
. ./login.sh

# createRoom
res=$(
    POST "/console/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
                "name": "testName"
            }'
)
id=$(echo $res | jq -r '.id')

# findRooms
res=$(
    GET "/console/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms?$PAGE_OPT" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)

# getRoom
res=$(
    GET "/console/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms/$id" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)
