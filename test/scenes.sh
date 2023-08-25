#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh
. ./login.sh

# findScenes
res=$(
    GET "/console/scenes?projectId=$PROJECT_ID&$PAGE_OPT" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)

# getScene
res=$(
    GET "/console/scenes/$SCENE_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)
