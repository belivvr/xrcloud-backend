#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-console.sh
. ./@config.sh
. ./login.sh

# findScenes
GET "/console/scenes?projectId=$PROJECT_ID&$PAGE_OPT" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getScene
GET /console/scenes/$SCENE_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# # removeScene
# DELETE /console/scenes/$SCENE_ID \
#     -H "Authorization: Bearer $ACCESS_TOKEN"