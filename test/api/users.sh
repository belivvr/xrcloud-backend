#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh

# createUser
res=$(
    POST "/api/projects/$PROJECT_ID/users" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
                "personalId": "'$PERSONAL_ID'"
            }'
)
