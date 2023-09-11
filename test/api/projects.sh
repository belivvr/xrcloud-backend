#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-api.sh
. ../@config.sh

# getProject
GET /api/projects/$PROJECT_ID \
    -H "Authorization: Bearer $API_KEY"
