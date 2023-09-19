#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@config.sh

# createAdmin
POST /admins \
    -H 'Content-Type: application/json' \
    -d '{
            "email": "zizi2717@belivvr.com",
            "password": "123123a!"
        }'

ADMIN_ID=$(echo $BODY | jq -r '.id')

#
. ./login.sh

# # updatePassword
# POST /admins/update-password \
#     -H "Authorization: Bearer $ACCESS_TOKEN" \
#     -H "Content-Type: application/json" \
#     -d '{
#             "oldPassword": "123123",
#             "newPassword": "112233"
#         }'

# generateApiKey
POST /admins/generate-api-key \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# # removeAdmin
# DELETE /admins/$ADMIN_ID \
#     -H "Authorization: Bearer $ACCESS_TOKEN"