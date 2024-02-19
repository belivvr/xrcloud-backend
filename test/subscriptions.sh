#!/bin/bash
set -e

. "$(dirname "$0")"/@config.sh
login

# findTiers
GET /subscriptions/tiers \
    -H "Authorization: Bearer $ACCESS_TOKEN"