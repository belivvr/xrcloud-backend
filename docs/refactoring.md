# Refactoring


## full refactoring 1

commit 99d8dba

0. 기존 'shallow routing'에서 'nested routing'으로 라우팅 구조 변경
 - [GET] /rooms/:roomId?projectId=${projectId}&sceneId=${sceneId}&...
    - 리소스들(project, scene, room, ...)을 독립적으로 관리할 수 있어 선택했었음
    - 외부에 오픈해야하는 api
        - 리소스들의 관계를 표현하기에 부족하다는 느낌을 받음
 - [GET] /projects/:projectId/scenes/:sceneId/rooms/:roomId
    - 프론트 구조 상 특정 room에 대한 정보를 얻으려면 해당 room의 projectId와 sceneId를 알아야 함
    - 복잡한 리소스들의 관계를 보다 명확히 표현할 수 있음
    - 확장성이 낮아지겠지만 해당 부분은 고려하지 않기로 함
    - 리소스 관련 api 모두 projects.controller.ts


## full refactoring 2

commit 3feaa86

0. 인증 수단 변경 'project key' -> 'api key'
 - project 하나에 하나를 보유할 수 있는 project key로의 인증에서 admin/api key로 인증 수단 변경

1. end-point 분리
 - console/api


## remove user

commit 36adf7d

0. user module 삭제
 - 'personalId' 개념 삭제에 따른 모듈 삭제
 - 기존 user가 가지고 있었던 token, infraUserId 등을 redis에 담아 관리
    - 관련 reticulum 코드 수정


## full refactoring 3

commit 9587efc

0. 'nested routing' -> 'shallow routing'
 - 'nested routing'
    - 1과 2에서 작업되었던 부분들로 인해 의존성, 일관성 등 손상
    - '리소스 간의 연관 관계가 명확한 것' 이외의 장점을 찾을 수 없음
- 'shallow routing'
    - 라우트, 모듈 관리 용이함
    - 확장성

1. module depth의 index.ts 삭제


## full refactoring 4

commit 8632301

0. 코드 전체 구조 변경
 - domain - controller - service
 - controller들을 모아 'constrollers'에서 관리
 - 타 모듈들 'services'로 이동, entity/dto 등 포함