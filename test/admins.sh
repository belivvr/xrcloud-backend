#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@config.sh
. ./@env-console.sh

# createAdmin
POST /admins \
    -H 'Content-Type: application/json' \
    -d '{
            "email": "'$EMAIL'",
            "password": "'$PASSWORD'"
        }'

ADMIN_ID=$(echo $BODY | jq -r '.id')

#
. ./login.sh

# updatePassword
POST /admins/$ADMIN_ID/update-password \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
            "oldPassword": "'$PASSWORD'",
            "newPassword": "123123a!"
        }'

# generateApiKey
POST /admins/$ADMIN_ID/generate-api-key \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# removeAdmin
DELETE /admins/$ADMIN_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN"
