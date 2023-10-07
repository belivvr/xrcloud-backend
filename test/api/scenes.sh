#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-api.sh
. ../@config.sh

# findScenes
GET "/scenes?projectId=$PROJECT_ID&$PAGE_OPT" \
    -H "x-xrcloud-api-key: $API_KEY"

SCENE_ID=$(echo $BODY | jq -r '.items[0].id')

# getScene
GET /scenes/$SCENE_ID \
    -H "x-xrcloud-api-key: $API_KEY"

# # removeScene
# DELETE /scenes/$SCENE_ID \
#     -H "x-xrcloud-api-key: $API_KEY"
