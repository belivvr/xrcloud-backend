#!/bin/bash
cd "$(dirname "$0")"

#
. ./@config.sh

# create
res=$(
    POST /admins \
        -H "Content-Type: application/json" \
        -d '{
                "email": "zizi2717@belivvr.com",
                "password": "123123"
            }'
)
