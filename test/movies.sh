#!/bin/bash
cd "$(dirname "$0")"
. ./@config.sh

# 새로운 영화 생성
# title: 영화 제목
# plot: 영화 줄거리
# runningTimeInMinutes: 영화 러닝타임 (분)
# director: 감독 이름
# rated: 등급
# genres: 장르 목록
# releaseDate: 개봉일
res=$(
    POST /movies \
        -H "Content-Type: application/json" \
        -d '{
                "title": "Test Movie",
                "plot": "This is a test movie plot",
                "runningTimeInMinutes": 120,
                "director": "Test Director",
                "rated": "G",
                "genres": ["Action", "Adventure"],
                "releaseDate": "2023-06-16T15:12:00.000Z"
            }'
)
id=$(echo $res | jq -r '.id')

# 모든 영화 조회
res=$(GET /movies)

# 특정 ID를 가진 영화 조회
res=$(GET /movies/$id)

# 특정 ID를 가진 영화 업데이트
res=$(
    PATCH /movies/$id \
        -H "Content-Type: application/json" \
        -d '{
                "title": "Updated Movie",
                "plot": "This is an updated test movie plot",
                "runningTimeInMinutes": 130,
                "director": "Updated Director",
                "rated": "PG",
                "genres": ["Action", "Comedy"],
                "releaseDate": "2023-06-16T15:12:00.000Z"
            }'
)

# 특정 ID를 가진 영화 삭제
res=$(DELETE /movies/$id)
