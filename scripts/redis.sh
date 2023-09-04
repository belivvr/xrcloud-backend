#!/bin/bash

#
container_exists=$(docker ps -a -q -f name=redis)

if [ ! -z "$container_exists" ]; then
    docker stop redis
    docker rm redis
fi

#
docker network create \
    --subnet=172.18.0.0/16 \
    xrcloud || true

#
docker run --restart always -d \
    --name redis \
    --network xrcloud \
    --ip 172.18.0.10 \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    -p 6379:6379 \
    -v ~/etc/redis/redis.conf:/etc/redis/redis.conf \
    -v ~/var/log/redis.log:/var/log/redis.log \
    redis:7.0 redis-server /etc/redis/redis.conf

#
echo "Docker container redis is up and running."