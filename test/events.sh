#!/bin/bash
set -e

. "$(dirname "$0")"/@config.sh

# createAdmin
POST /events/hub \
    -H 'Content-Type: application/json' \
    -d '{
            "type": "click-event",
            "eventTime": "2024-03-21 05:15:20.149315",
            "roomId": "GSmg6SC",
            "userId": "1721460995290825033",
            "eventAction": "Click: 'https://console.ncloud.com/vpc-compute/server'",
            "ip": "1.1.1.1"
        }'
