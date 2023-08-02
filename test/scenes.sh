#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh
. ./login.sh

# getSceneCreationUrl
res=$(
    GET "/projects/$PROJECT_ID/scenes/create-url?personalId=$PERSONAL_ID" \
        -H "Authorization: Bearer $PROJECT_KEY"
)

# getSceneModificationUrl
res=$(
    GET "/projects/$PROJECT_ID/scenes/$SCENE_ID/modify-url?personalId=$PERSONAL_ID" \
        -H "Authorization: Bearer $PROJECT_KEY"
)

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
