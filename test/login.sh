#!/bin/bash

#
. ./@config.sh

# login
POST /auth/login \
    -H 'Content-Type: application/json' \
    -d '{
            "email": "zizi2717@belivvr.com",
            "password": "123123"
        }'

ACCESS_TOKEN=$(echo $BODY | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $BODY | jq -r '.refreshToken')