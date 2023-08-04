#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh
. ./login.sh

# findScenes
res=$(
    GET "/console/projects/$PROJECT_ID/scenes?$PAGE_OPT" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)

# getScene
res=$(
    GET "/console/projects/$PROJECT_ID/scenes/$SCENE_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)
