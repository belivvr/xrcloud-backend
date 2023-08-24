#!/bin/bash
cd "$(dirname "$0")"

#
. ./@config.sh

# login
res=$(
    POST /auth/login \
        -H 'Content-Type: application/json' \
        -d '{
                "email": "zizi27177@belivvr.com",
                "password": "123123"
            }'
)

ACCESS_TOKEN=$(echo $res | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $res | jq -r '.refreshToken')

export ACCESS_TOKEN
export ADMIN_ID
