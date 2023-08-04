#!/bin/bash

clear

CURL() {
    HOST="http://localhost:3001"
    METHOD=$1
    ENDPOINT=$2
    shift 2

    response=$(curl -s -w "%{http_code}" -X $METHOD $HOST$ENDPOINT "$@")
    status="${response:${#response}-3}" # 마지막 3자리가 응답 코드
    body="${response:0:${#response}-3}" # 응답 코드를 제외한 본문

    if [[ "$status" -ge 300 ]]; then
        echo -e "\e[1;31m$status\e[0m \e[1;35m$METHOD\e[0m \e[1;36m$HOST$ENDPOINT\e[0m" >&2
        echo "$body" | jq '.' >&2
        echo "" >&2
    else
        echo -e "\e[1;32m$status\e[0m \e[1;35m$METHOD\e[0m \e[1;36m$HOST$ENDPOINT\e[0m" >&2
        echo "$body" | jq '.' >&2
        echo "" >&2
        echo "$body"
    fi
}

POST() {
    CURL POST "$@"
}

GET() {
    CURL GET "$@"
}

DELETE() {
    CURL DELETE "$@"
}

PATCH() {
    CURL PATCH "$@"
}

PUT() {
    CURL PUT "$@"
}