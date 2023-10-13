#!/bin/bash

#
. ./@config.sh

# login
POST /auth/login \
    -H 'Content-Type: application/json' \
    -d '{
            "email": "'$EMAIL'",
            "password": "'$PASSWORD'"
        }'

ACCESS_TOKEN=$(echo $BODY | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $BODY | jq -r '.refreshToken')