#!/bin/bash
set -e

. "$(dirname "$0")"/@config.sh
login

# createRoom
POST /api/rooms \
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
GET "/api/rooms?sceneId=$SCENE_ID&$PAGE_OPT&linkPayload=cnu%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNmU5YzI1NDYtYzRhNi00ZGNkLWI2NDYtOTRmM2NhYWZlMjE0IiwiZW1haWwiOiJjbnUxQGJlbGl2dnIuc2kiLCJqdGkiOiIxYzAyMzRjNC00ODA2LTQwODAtYTQ3Ny02MmVlMTdlMmJhZmIiLCJpYXQiOjE3MDc5ODEzODIsImV4cCI6MTcwOTcwOTM4Mn0.vPDYUaSxql2hlQL6q_tO1TTHGLMf7s38onkacMenXRI" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getRoom
GET /api/rooms/$ROOM_ID?linkPayload=cnu:$REFRESH_TOKEN \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getInfraRoom
GET /api/rooms/d6794aa2-6063-4a69-9cba-ce89b8a9c7f7/infra \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getOption
GET /api/rooms/option/f27668e5-0c8b-4441-81fd-31a154ad4236?type=private

# updateRoom
PATCH /api/rooms/$ROOM_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
            "name": "Updated Test Room Name",
            "size": 5,
            "returnUrl": "https://naver.com"
        }'

# removeRoom
DELETE /api/rooms/$ROOM_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN"
