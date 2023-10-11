#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-console.sh
. ./@config.sh
. ./login.sh

# create
POST /api/projects \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: multipart/form-data" \
    -F "favicon=@$FILE_PATH/favicon.ico" \
    -F "logo=@$FILE_PATH/logo.png" \
    -F "name=testName"

PROJECT_ID=$(echo $BODY | jq -r '.id')

# findProjects
GET /api/projects?$PAGE_OPT \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# getProject
GET /api/projects/$PROJECT_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# updateProject
PATCH /api/projects/$PROJECT_ID \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: multipart/form-data" \
    -F "favicon=@$FILE_PATH/favicon.ico" \
    -F "logo=@$FILE_PATH/logo.png" \
    -F "name=testName"

# # removeProject
# DELETE /api/projects/$PROJECT_ID \
#     -H "Authorization: Bearer $ACCESS_TOKEN"
