#!/bin/bash
cd "$(dirname "$0")"

#
. ./@config.sh

# login
res=$(
    POST /auth/login \
        -H 'Content-Type: application/json' \
        -d '{
                "email": "zizi2717@belivvr.com",
                "password": "123123"
            }'
)

ACCESS_TOKEN=$(echo $res | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $res | jq -r '.refreshToken')

# get profile
res=$(
    GET /auth/profile \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)

ADMIN_ID=$(echo $res | jq -r '.id')

export ACCESS_TOKEN
export ADMIN_ID