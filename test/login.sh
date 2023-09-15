#!/bin/bash

#
. ./@config.sh

# login
POST /auth/login \
    -H 'Content-Type: application/json' \
    -d '{
            "email": "zizi271777@belivvr.com",
            "password": "123123a!"
        }'

ACCESS_TOKEN=$(echo $BODY | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $BODY | jq -r '.refreshToken')