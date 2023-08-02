#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh

# createUser
res=$(
    POST /projects/$PROJECT_ID/users \
        -H "Authorization: Bearer $PROJECT_KEY" \
        -H "Content-Type: application/json" \
        -d '{
                "personalId": "'$PERSONAL_ID'"
            }'
)
