#!/bin/bash

#
. ./@config.sh

# login
POST /auth/login \
    -H 'Content-Type: application/json' \
    -d '{
            "email": "zizi27177@belivvr.com",
            "password": "112233"
        }'

ACCESS_TOKEN=$(echo $BODY | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $BODY | jq -r '.refreshToken')