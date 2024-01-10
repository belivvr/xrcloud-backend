#!/bin/bash

#
docker rm -f xrcloud-redis

#
docker network create xrcloud || true

#
docker run --restart always -d \
    --name xrcloud-redis \
    --network xrcloud \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    redis:7.0 redis-server

#
echo "Docker container redis is up and running."