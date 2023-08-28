#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh
. ./login.sh

# create
res=$(
    POST /console/projects \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H 'Content-Type: multipart/form-data' \
        -F "favicon=@$FILE_PATH/favicon.ico" \
        -F "logo=@$FILE_PATH/logo.png" \
        -F "name=testName"
)
id=$(echo $res | jq -r '.id')

# findProjects
res=$(
    GET "/console/projects?$PAGE_OPT" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)

# getProject
res=$(
    GET "/console/projects/$id" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)

# updateProject
res=$(
    PATCH "/console/projects/$id" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H 'Content-Type: multipart/form-data' \
        -F "favicon=@$FILE_PATH/favicon.ico" \
        -F "logo=@$FILE_PATH/logo.png" \
        -F "name=testName"
)

# removeProject
res=$(
    DELETE "/console/projects/$id" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)
