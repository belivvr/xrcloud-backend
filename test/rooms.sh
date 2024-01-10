#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-console.sh
. ./@config.sh
. ./login.sh

# # createRoom
# POST /api/rooms \
#     -H "Authorization: Bearer $ACCESS_TOKEN" \
#     -H "Content-Type: application/json" \
#     -d '{
#             "projectId": "'$PROJECT_ID'",
#             "sceneId": "'$SCENE_ID'",
#             "name": "testName",
#             "size": 9,
#             "returnUrl": "https://naver.com"
#         }'

# ROOM_ID=$(echo $BODY | jq -r '.id')

# # findRooms
# GET "/api/rooms?sceneId=$SCENE_ID&$PAGE_OPT&avatarUrl=https://kr.object.ncloudstorage.com/econet-front/Crab_001.glb" \
#     -H "Authorization: Bearer $ACCESS_TOKEN"

# getRoom
GET /api/rooms/3141c226-adb5-4c5b-bfdc-ad184b1b3fb6?avatarUrl=https://kr.object.ncloudstorage.com/econet-front/Crab_001.glb \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# # getOption
# GET /api/rooms/option/$OPTION_ID?type=private

# # updateRoom
# PATCH /api/rooms/$ROOM_ID \
#     -H "Authorization: Bearer $ACCESS_TOKEN" \
#     -H "Content-Type: application/json" \
#     -d '{
#             "name": "Updated Test Room Name",
#             "size": 5,
#             "returnUrl": "https://naver.com"
#         }'

# # removeRoom
# DELETE /api/rooms/$ROOM_ID \
#     -H "Authorization: Bearer $ACCESS_TOKEN"
