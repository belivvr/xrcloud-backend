#!/bin/bash

#
docker network create \
    --subnet=172.18.0.0/16 \
    xrcloud || true

#
docker run --restart always -d \
    --name cron \
    --network xrcloud \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    -v ./cron:/etc/cron \
    -v ~/var/log/cron:/var/log \
    cron