#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@config.sh
. ./login.sh

# getProfile
GET /auth/profile \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# refresh
POST /auth/refresh \
    -H "Content-Type: application/json" \
    -d '{
            "refreshToken": "'$REFRESH_TOKEN'"
        }'
