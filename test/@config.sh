#!/bin/bash
HOST="http://localhost:3000"

EMAIL='cnu1@belivvr.si'
PASSWORD='cnu1234!@'

FILE_PATH='./files'
PAGE_OPT='take=100&skip=0'

ADMIN_ID='24198a53-b4a6-4548-b560-10da80b7d0e1'
PROJECT_ID='be4491e1-6580-4a66-9e55-546830995ba8'
SCENE_ID='468ce665-693f-4d12-8155-7f92328a3c44'
ROOM_ID='73dc6352-a429-4e0e-b39e-cd4dda4aeba7'
OPTION_ID='66f1381c-ef4b-4691-92c0-474676f0d5df'

USER_ID='test@test.com'
CREATOR='test@belivvr.com'

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

login() {
    POST /auth/login \
        -H 'Content-Type: application/json' \
        -d '{
                "email": "'$EMAIL'",
                "password": "'$PASSWORD'"
            }'

    ACCESS_TOKEN=$(echo $BODY | jq -r '.accessToken')
    REFRESH_TOKEN=$(echo $BODY | jq -r '.refreshToken')
}
