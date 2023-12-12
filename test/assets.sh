#!/bin/bash
set -e
cd "$(dirname "$0")"

#
. ./@env-console.sh
. ./@config.sh

# create
POST /assets \
    -H "Content-Type: multipart/form-data" \
    -F "file=@$FILE_PATH/testGlb.glb"
