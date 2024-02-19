#!/bin/bash
set -e

. "$(dirname "$0")"/@config.sh
login

# getProfile
GET /auth/profile \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# refresh
POST /auth/refresh \
    -H "Content-Type: application/json" \
    -d '{
            "refreshToken": "'$REFRESH_TOKEN'"
        }'
