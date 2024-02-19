#!/bin/bash
set -e

. "$(dirname "$0")"/@config.sh

# create
POST /assets \
    -H "Content-Type: multipart/form-data" \
    -F "file=@$FILE_PATH/testGlb.glb"
