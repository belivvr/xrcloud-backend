#!/bin/bash
set -e

. "$(dirname "$0")"/@config.sh
login

# create
POST /subscriptions/tier \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
            "name": "starter"
        }'

# # create
# POST /subscriptions/tier \
#     -H "Authorization: Bearer $ACCESS_TOKEN" \
#     -H "Content-Type: application/json" \
#     -d '{
#             "productCode": "product_ElbeyhCS8",
#             "priceCode": "price_utcAwEP9u",
#             "name": "starter",
#             "currency": "KRW",
#             "price": "8800"
#         }'

# findSubsTiers
GET /subscriptions/tier?$PAGE_OPT \
    -H "Authorization: Bearer $ACCESS_TOKEN"

# createPayment
POST /subscriptions/payment \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
            "subsTierId": 2,
            "successUrl": "https://xrcloud.app",
            "errorUrl": "https://xrcloud.app",
            "cancelUrl": "https://xrcloud.app"
        }'
