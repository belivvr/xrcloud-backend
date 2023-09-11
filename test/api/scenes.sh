#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-api.sh
. ../@config.sh

# findScenes
GET "/api/scenes?projectId=$PROJECT_ID&$PAGE_OPT" \
    -H "Authorization: Bearer $API_KEY"

SCENE_ID=$(echo $BODY | jq -r '.items[0].id')

# getScene
GET /api/scenes/$SCENE_ID \
    -H "Authorization: Bearer $API_KEY"

# removeScene
DELETE /api/scenes/$SCENE_ID \
    -H "Authorization: Bearer $API_KEY"
