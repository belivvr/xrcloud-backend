#!/bin/bash
cd "$(dirname "$0")"

#
. ./@config.sh

# createAdmin
res=$(
    POST /admins \
        -H "Content-Type: application/json" \
        -d '{
                "email": "zizi2717@belivvr.com",
                "password": "123123"
            }'
)

# generateApiKey
res=$(
    PATCH /admins/api-key \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)
