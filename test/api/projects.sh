#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-api.sh
. ../@config.sh

# getProject
GET /projects/$PROJECT_ID \
    -H "x-xrcloud-api-key: $API_KEY"
