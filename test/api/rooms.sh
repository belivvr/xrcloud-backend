#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh

# createRoom
res=$(
    POST "/api/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
                "userId": "'$USER_ID'",
                "name": "Test Room Name"
            }'
)
id=$(echo $res | jq -r '.id')

# findRooms
res=$(
    GET "/api/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms?$PAGE_OPT&userId=$USER_ID" \
        -H "Authorization: Bearer $API_KEY"
)

# getRoom
res=$(
    GET "/api/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms/$id" \
        -H "Authorization: Bearer $API_KEY"
)

# updateRoom
res=$(
    PATCH "/api/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms/$id" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
                "userId": "'$USER_ID'",
                "name": "Updated Test Room Name",
                "size": 5
            }'
)

# removeRoom
res=$(
    DELETE "/api/projects/$PROJECT_ID/scenes/$SCENE_ID/rooms/$id" \
        -H "Authorization: Bearer $API_KEY"
)
