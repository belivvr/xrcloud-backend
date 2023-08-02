#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh
. ./login.sh

# create
res=$(
    POST /projects \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H 'Content-Type: multipart/form-data' \
        -F "favicon=@$FILE_PATH/favicon.ico" \
        -F "logo=@$FILE_PATH/logo.png" \
        -F "name=testName"
)
id=$(echo $res | jq -r '.id')

# findProjects
res=$(GET "/projects?$PAGE_OPT" \
    -H "Authorization: Bearer $ACCESS_TOKEN"
)

# getProject
res=$(
    GET "/projects/$id" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)

# updateProject
res=$(
    PATCH "/projects/$id" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H 'Content-Type: multipart/form-data' \
        -F "favicon=@$FILE_PATH/favicon.ico" \
        -F "logo=@$FILE_PATH/logo.png" \
        -F "name=testName"
)

# generateKey
res=$(
    PATCH "/projects/$id/generate-key" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)

# removeProject
res=$(
    DELETE "/projects/$id" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)
