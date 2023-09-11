#!/bin/bash
HOST="http://localhost:3001"

CURL() {
    METHOD=$1
    ENDPOINT=$2
    shift 2

    local response=$(curl -s -w "%{http_code}" -X $METHOD $HOST$ENDPOINT "$@")
    STATUS="${response:${#response}-3}" # 마지막 3자리가 응답 코드
    BODY="${response:0:${#response}-3}" # 응답 코드를 제외한 본문

    if [[ "$STATUS" -ge 300 ]]; then
        message="\e[1;31m$STATUS\e[0m \e[1;35m$METHOD\e[0m \e[1;36m$HOST$ENDPOINT\e[0m"
    else
        message="\e[1;32m$STATUS\e[0m \e[1;35m$METHOD\e[0m \e[1;36m$HOST$ENDPOINT\e[0m"
    fi

    echo -e $message >&2
    echo "$BODY" | jq '.' >&2
    echo "" >&2
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