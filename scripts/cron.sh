#!/bin/bash

#
docker network create \
    --subnet=172.18.0.0/16 \
    xrcloud || true

#
docker run --restart always -d \
    --name cron \
    --network xrcloud \
    -v ./cron:/etc/cron \
    -v ~/workspace/xrcloud-backend/.env:/app/.env \
    -v ~/var/log/cron:/var/log \
    cron