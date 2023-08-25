#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh
. ./login.sh

# createRoom
res=$(
    POST "/console/rooms" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
                "projectId": "'$PROJECT_ID'",
                "sceneId": "'$SCENE_ID'",
                "name": "testName"
            }'
)
id=$(echo $res | jq -r '.id')

# findRooms
res=$(
    GET "/console/rooms?sceneId=$SCENE_ID&$PAGE_OPT" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)

# getRoom
res=$(
    GET "/console/rooms/$id" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)
