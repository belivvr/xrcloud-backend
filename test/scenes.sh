#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh
. ./login.sh

# findScenes
res=$(
    GET "/projects/$PROJECT_ID/scenes?$PAGE_OPT" \
        -H "Authorization: Bearer $PROJECT_KEY"
)

# getScene
res=$(
    GET "/projects/$PROJECT_ID/scenes/$SCENE_ID" \
        -H "Authorization: Bearer $PROJECT_KEY"
)
