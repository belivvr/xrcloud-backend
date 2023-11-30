#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@config.sh
. ./@env-console.sh

# login
POST /auth/login \
    -H 'Content-Type: application/json' \
    -d '{
            "email": "'$EMAIL'",
            "password": "'$PASSWORD'"
        }'

ACCESS_TOKEN=$(echo $BODY | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $BODY | jq -r '.refreshToken')

# logout
POST /auth/logout \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $ACCESS_TOKEN"
