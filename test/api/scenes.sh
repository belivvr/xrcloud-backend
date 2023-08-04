#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh

# findScenes
res=$(
    GET "/api/projects/$PROJECT_ID/scenes?$PAGE_OPT" \
        -H "Authorization: Bearer $API_KEY"
)

# getScene
res=$(
    GET "/api/projects/$PROJECT_ID/scenes/$SCENE_ID" \
        -H "Authorization: Bearer $API_KEY"
)

# removeScene
res=$(
    DELETE "/api/projects/$PROJECT_ID/scenes/$SCENE_ID" \
        -H "Authorization: Bearer $API_KEY"
)
