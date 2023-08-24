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
id=$(echo $res | jq -r '.items[0].id')

# getScene
res=$(
    GET "/api/projects/$PROJECT_ID/scenes/$id" \
        -H "Authorization: Bearer $API_KEY"
)

# removeScene
res=$(
    DELETE "/api/projects/$PROJECT_ID/scenes/$id" \
        -H "Authorization: Bearer $API_KEY"
)
