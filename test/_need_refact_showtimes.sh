# 개선해야 한다.

movieId=$(
    curl -X POST \
        -H "Content-Type: application/json" \
        -d '{
                "title": "Test Movie",
                "plot": "This is a test movie plot",
                "runningTimeInMinutes": 120,
                "director": "Test Director",
                "rated": "G",
                "genres": ["Action", "Adventure"],
                "releaseDate": "2023-06-16T15:12:00.000Z"
            }' "http://localhost:3000/movies" | jq -r '.id'
)

# Create Theater and extract the ID from the response body
theater1Id=$(curl -S -X POST -H "Content-Type: application/json" -d '{
    "name": "Theater1 Name",
    "address": "Theater1 Address",
    "latitude": "32.001",
    "longitude": "128.123"
}' "http://localhost:3000/theaters" | jq -r '.id')

theater2Id=$(curl -S -X POST -H "Content-Type: application/json" -d '{
    "name": "Theater2 Name",
    "address": "Theater2 Address",
    "latitude": "32.001",
    "longitude": "128.123"
}' "http://localhost:3000/theaters" | jq -r '.id')

echo "Movie ID: $movieId"
echo "Theater ID: $theater1Id"
echo "Theater ID: $theater2Id"

set -x
# Create Showtimes
curl -X POST -H "Content-Type: application/json" -d '[
    {
        "movieId": "'$movieId'",
        "theaterId": "'$theater1Id'",
        "showtimes": [
            { "startDatetime": "2123-12-12T09:00:00" },
            { "startDatetime": "2123-12-12T11:00:00" },
            { "startDatetime": "2123-12-12T13:00:00" }
        ]
    },
    {
        "movieId": "'$movieId'",
        "theaterId": "'$theater2Id'",
        "showtimes": [
            { "startDatetime": "2123-12-13T09:00:00" },
            { "startDatetime": "2123-12-13T11:00:00" },
            { "startDatetime": "2123-12-13T13:00:00" }
        ]
    }
]' "http://localhost:3000/showtimes"

exit 0
# Create Conflicting Showtimes
curl -X POST -H "Content-Type: application/json" -d '[
    {
        "movieId": "movie1.id",
        "theaterId": "theater1.id",
        "showtimes": [
            { "startDatetime": "2123-12-12T09:00:00" },
            { "startDatetime": "2123-12-12T12:00:00" },
            { "startDatetime": "2123-12-12T15:00:00" }
        ]
    },
    {
        "movieId": "movie1.id",
        "theaterId": "theater2.id",
        "showtimes": [
            { "startDatetime": "2123-12-13T07:20:00" },
            { "startDatetime": "2123-12-13T11:00:00" },
            { "startDatetime": "2123-12-13T14:40:00" }
        ]
    }
]' "http://localhost:3000/showtimes"

# # Get All Showtimes
# curl -X GET "http://localhost:3000/showtimes"

# # Get Showtimes with Options
# curl -X GET "http://localhost:3000/showtimes?time=future"

# # Invalid Request
# curl -X GET "http://localhost:3000/showtimes?wrong"

# # Get All Showtimes
# curl -X GET "http://localhost:3000/showtimes"

# # Get Showtimes with Invalid Options
# curl -X GET "http://localhost:3000/showtimes?time=future&orderby=name:asc"

# # Invalid Request
# curl -X GET "http://localhost:3000/showtimes?wrong"
