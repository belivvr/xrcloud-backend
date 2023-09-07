#!/bin/bash
cd "$(dirname "$0")"

#
. ./@env.sh
. ./@config.sh
. ./login.sh

# create
res=$(
    POST /subscriptions/tier \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
                "name": "starter"
            }'
)
id=$(echo $res | jq -r '.id')

# # create
# res=$(
#     POST /subscriptions/tier \
#         -H "Authorization: Bearer $ACCESS_TOKEN" \
#         -H "Content-Type: application/json" \
#         -d '{
#                 "productCode": "product_ElbeyhCS8",
#                 "priceCode": "price_utcAwEP9u",
#                 "name": "starter",
#                 "currency": "KRW",
#                 "price": "8800"
#             }'
# )
# id=$(echo $res | jq -r '.id')

# findSubsTiers
res=$(
    GET "/subscriptions/tier?$PAGE_OPT" \
        -H "Authorization: Bearer $ACCESS_TOKEN"
)

# createPayment
res=$(
    POST /subscriptions/payment \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
                "subsTierId": 2,
                "successUrl": "https://xrcloud.app",
                "errorUrl": "https://xrcloud.app",
                "cancelUrl": "https://xrcloud.app"
            }'
)
