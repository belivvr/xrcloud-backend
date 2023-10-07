#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-console.sh
. ./@config.sh
. ./login.sh

# findScenes
GET "/scenes?projectId=$PROJECT_ID&$PAGE_OPT" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getScene
GET /scenes/$SCENE_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getOption
GET /scenes/option/$OPTION_ID

# # removeScene
# DELETE /scenes/$SCENE_ID \
#     -H "Authorization: Bearer $ACCESS_TOKEN"
