#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-console.sh
. ./@config.sh
. ./login.sh

# findScenes
GET "/api/scenes?projectId=$PROJECT_ID&$PAGE_OPT" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getScene
GET /api/scenes/$SCENE_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getOption
GET /api/scenes/option/$OPTION_ID

# # removeScene
# DELETE /api/scenes/$SCENE_ID \
#     -H "Authorization: Bearer $ACCESS_TOKEN"
