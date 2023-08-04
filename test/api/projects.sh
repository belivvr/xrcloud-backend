#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh

# getProject
res=$(
    GET "/api/projects/$PROJECT_ID" \
        -H "Authorization: Bearer $API_KEY"
)
