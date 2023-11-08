#!/bin/bash

env=$1
script_dir=$(dirname $(realpath $0))

#
container_exists=$(docker ps -a -q -f name=cron)

if [ ! -z "$container_exists" ]; then
    docker stop cron
    docker rm cron
fi

#
image_exists=$(docker images -q cron:$env)

if [ ! -z "$image_exists" ]; then
    docker rmi cron:$env
fi

#
dockerfile="$script_dir/cron/Dockerfile.$env"

if [ ! -f $dockerfile ]; then
    echo "Error: $dockerfile does not exist."
    exit 1
fi

#
docker build -t cron:$env -f $dockerfile "$script_dir/cron"

docker network create xrcloud || true

docker run --restart always -d \
    --name cron \
    --network xrcloud \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    -v $script_dir/cron/.env:/app/.env \
    cron:$env

#
echo "Docker container cron is up and running."
