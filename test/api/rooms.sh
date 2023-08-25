#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh

# createRoom
res=$(
    POST "/api/rooms" \
        -H "Authorization: Bearer $API_KEY" \
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
    GET "/api/rooms?sceneId=$SCENE_ID&userId=$USER_ID&$PAGE_OPT" \
        -H "Authorization: Bearer $API_KEY"
)

# getRoom
res=$(
    GET "/api/rooms/$id?userId=$USER_ID" \
        -H "Authorization: Bearer $API_KEY"
)

# updateRoom
res=$(
    PATCH "/api/rooms/$id" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
                "name": "Updated Test Room Name",
                "size": 5
            }'
)

# removeRoom
res=$(
    DELETE "/api/rooms/$id" \
        -H "Authorization: Bearer $API_KEY"
)
