#!/bin/bash

#
. ./@env-console.sh
. ./@config.sh
. ./login.sh

# findTiers
GET /subscriptions/tiers \
    -H "Authorization: Bearer $ACCESS_TOKEN"