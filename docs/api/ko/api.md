---
title: XRCLOUD API v1.1
language_tabs:
  - javascript: JavaScript
  - python: Python
language_clients:
  - javascript: ""
  - python: ""
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="xrcloud-api">XRCLOUD API v1.1</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

<h1 id="xrcloud-api-project">project</h1>

XRCLOUD의 Project는 개발자의 프로젝트, 플랫폼, 또는 3rd-party 애플리케이션이 될 수 있습니다. 이는 Scene과 Room을 관리하는 단위로, 여러 Scene과 Room이 특정 Project에 속하게 됩니다. 

 - `webhookUrl`은 XRCLOUD 페이지에서 Project를 생성하거나 정보를 수정할 때 설정할 수 있습니다.

## 라벨로 프로젝트 가져오기

<a id="opIdGetProjectsByLabel"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/projects',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.get('/api/projects', headers = headers)

print(r.json())

```

`GET /api/projects`

라벨로 필터링하여 프로젝트를 가져옵니다. `label` 쿼리 파라미터를 사용하여 특정 라벨의 프로젝트를 필터링할 수 있습니다.

<h3 id="라벨로-프로젝트-가져오기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|label|query|string|false|필터링할 프로젝트의 라벨입니다. 제공되지 않으면 모든 프로젝트가 반환됩니다.|

> Example responses

> 200 Response

```json
[
  {
    "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
    "name": "example project name",
    "webhookUrl": "https://api.example.com/webhook",
    "createdAt": "2023-07-12T09:27:41.600Z",
    "updatedAt": "2023-07-12T09:27:41.600Z",
    "faviconUrl": "https://api.xrcloud.app/favicon/4a3/4a3e946e-2776-4182-afb7-204d982b727d.ico",
    "logoUrl": "https://api.xrcloud.app/favicon/51d/51dc73cc-36db-4046-af8d-1e61e4b59c19.jpg"
  }
]
```

<h3 id="라벨로-프로젝트-가져오기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|Inline|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<h3 id="라벨로-프로젝트-가져오기-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Project](#schemaproject)]|false|none|none|
|» id|string|false|none|(projectId) Project의 고유 ID.|
|» name|string|false|none|Project의 이름.|
|» webhookUrl|string|false|none|사용자의 Room/Scene 활동 로그를 전송받을 webhook URL입니다. 이 URL로 다음과 같은 이벤트 발생 시 로그가 POST 요청으로 전송됩니다:<br><br>**Room 관련 이벤트**<br>- room-join: 사용자가 Room에 입장<br>- room-exit: 사용자가 Room에서 퇴장<br>- room-video-click-event: Room 내 비디오 클릭 이벤트<br><br>**Scene 관련 이벤트**<br>- scene-created: Scene 생성<br>- scene-updated: Scene 수정<br><br>**Webhook 요청 데이터 형식**<br>```json<br>{<br>  "code": "room-join",              // 이벤트 코드<br>  "resourceId": "uuid",            // Room/Scene의 ID<br>  "sessionId": "uuid",             // 세션 ID<br>  "reticulumId": "string",         // XRCLOUD(Hubs)의 사용자 ID<br>  "logTime": "2024-01-01T00:00:00Z", // 이벤트 발생 시간<br>  "action": "string",              // 이벤트 액션 정보<br>  "ip": "string",                  // 사용자 IP<br>  "userAgent": "string",           // 사용자 브라우저 정보<br>  "device": "string"               // 사용자 디바이스 정보 (pc/mobile/vr)<br>}```<br><br>**참고**: 현재 ip와 userAgent 값은 제대로 전송되지 않을 수 있습니다.|
|» createdAt|string(date-time)|false|none|Project가 생성된 날짜와 시간.|
|» updatedAt|string(date-time)|false|none|Project가 마지막으로 업데이트된 날짜와 시간.|
|» faviconUrl|string|false|none|Project의 파비콘 URL.|
|» logoUrl|string|false|none|Project의 로고의 URL.|

<aside class="success">
This operation does not require authentication
</aside>

## 프로젝트 생성

<a id="opIdCreateProject"></a>

> Code samples

```javascript
const inputBody = '{
  "favicon": "string",
  "logo": "string",
  "name": "string",
  "label": "string"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json'
};

fetch('/api/projects',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Content-Type': 'multipart/form-data',
  'Accept': 'application/json'
}

r = requests.post('/api/projects', headers = headers)

print(r.json())

```

`POST /api/projects`

다음과 같은 형식으로 프로젝트를 생성할 수 있습니다:

```
RES=$(curl -s -X POST "$XRCLOUD_HOST/api/projects" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: multipart/form-data" \
    -F "favicon=@$FILE_DIR/favicon.ico" \
    -F "logo=@$FILE_DIR/logo.png" \
    -F "name=lms" \
    -F "label=lms"
)
```

이 API는 `multipart/form-data` 형식으로 프로젝트의 파비콘, 로고, 이름, 라벨을 포함하여 프로젝트를 생성합니다.

> Body parameter

```yaml
favicon: string
logo: string
name: string
label: string

```

<h3 id="프로젝트-생성-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» favicon|body|string(binary)|false|프로젝트의 파비콘 파일.|
|» logo|body|string(binary)|false|프로젝트의 로고 파일.|
|» name|body|string|false|프로젝트의 이름.|
|» label|body|string|false|프로젝트의 라벨.|

> Example responses

> 201 Response

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example project name",
  "webhookUrl": "https://api.example.com/webhook",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "faviconUrl": "https://api.xrcloud.app/favicon/4a3/4a3e946e-2776-4182-afb7-204d982b727d.ico",
  "logoUrl": "https://api.xrcloud.app/favicon/51d/51dc73cc-36db-4046-af8d-1e61e4b59c19.jpg"
}
```

<h3 id="프로젝트-생성-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|프로젝트가 성공적으로 생성되었습니다.|[Project](#schemaproject)|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

##  XRCLOUD에 서비스 사용자 계정, 생성 및 가져오기

<a id="opIdGetXrcloudUserId"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/projects/{projectId}/getIdFromUserId/{accountId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.get('/api/projects/{projectId}/getIdFromUserId/{accountId}', headers = headers)

print(r.json())

```

`GET /api/projects/{projectId}/getIdFromUserId/{accountId}`

사용자 서비스의 사용자ID를 전달하여 XRCLOUD에 사용자ID(reticulumId)를 생성하고 가져옵니다. 다른 Api에서 userId를 사용할 때 이 Api에 보낸 userId를 통해 플랫폼에 고유 사용자의 행위임을 전달합니다. logging 정보는 XRCLOUD의 사용자 ID인 reticulumId로 전달 됩니다.

<h3 id="-xrcloud에-서비스-사용자-계정,-생성-및-가져오기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|projectId|path|string|true|프로젝트의 고유 ID.|
|accountId|path|string|true|사용자의 계정 ID.|

> Example responses

> 200 Response

```json
{}
```

<h3 id="-xrcloud에-서비스-사용자-계정,-생성-및-가져오기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공적으로 사용자 ID를 가져왔습니다.|Inline|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<h3 id="-xrcloud에-서비스-사용자-계정,-생성-및-가져오기-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## 프로젝트 정보 가져오기

<a id="opIdGetProject"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/projects/{projectId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.get('/api/projects/{projectId}', headers = headers)

print(r.json())

```

`GET /api/projects/{projectId}`

<h3 id="프로젝트-정보-가져오기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|

> Example responses

> 200 Response

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example project name",
  "webhookUrl": "https://api.example.com/webhook",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "faviconUrl": "https://api.xrcloud.app/favicon/4a3/4a3e946e-2776-4182-afb7-204d982b727d.ico",
  "logoUrl": "https://api.xrcloud.app/favicon/51d/51dc73cc-36db-4046-af8d-1e61e4b59c19.jpg"
}
```

<h3 id="프로젝트-정보-가져오기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|[Project](#schemaproject)|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="xrcloud-api-scene">scene</h1>

웹페이지 기반의 3D 가상공간을 제작하는 공간으로 Room을 생성할 때 필요한 공간입니다. 

 [get-creation-url api](#operation/GetSceneCreationUrl)를 호출하면 얻을 수 있는 필드 중 'sceneCreationUrl'에 접속하여 에디터(Spoke)에 접근한 후 우상단의 Publish Scene 버튼을 통해 Scene을 생성할 수 있습니다. 또, [get-scene api](#operation/GetScene)를 호출하면 얻을 수 있는 필드 중 'sceneModificationUrl'에 접근하여 수정합니다. 

 - `optId` 값은 XRCLOUD에서 Scene의 생성 및 수정을 확인하기위한 callback value 입니다. 변형하여 사용하면 오류가 발생할 수 있습니다.

## 씬(Scene)리스트 정보 가져오기

<a id="opIdGetScenes"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/scenes',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.get('/api/scenes', params={
  'projectId': null
}, headers = headers)

print(r.json())

```

`GET /api/scenes`

<h3 id="씬(scene)리스트-정보-가져오기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|projectId|query|uuid|true|Project의 고유 ID.|
|name|query|string|false|(search) 해당 이름을 가진 Object 조회.|
|creator|query|string|false|(search) 특정 제작자의 Object 조회.|
|take|query|number|false|(pagination) 가져올 데이터의 갯수.|
|skip|query|number|false|(pagination) 건너뛸 데이터의 갯수.|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
      "name": "example scene name",
      "createdAt": "2023-07-12T09:27:41.600Z",
      "updatedAt": "2023-07-12T09:27:41.600Z",
      "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg",
      "sceneModificationUrl": "https://room.xrcloud.app:4000/spoke/projects/ASJCJK1?optId=35e75895-9db7-4eee-bae3-87e20ee156dc"
    }
  ],
  "total": 0,
  "skip": 0,
  "take": 0
}
```

<h3 id="씬(scene)리스트-정보-가져오기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|[GetScenesSuccessResponse](#schemagetscenessuccessresponse)|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## 씬에디터(Spoke)URL 가져와서 씬 생성하기

<a id="opIdGetSceneCreationUrl"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/scenes/get-creation-url',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.get('/api/scenes/get-creation-url', params={
  'projectId': null
}, headers = headers)

print(r.json())

```

`GET /api/scenes/get-creation-url`

<h3 id="씬에디터(spoke)url-가져와서-씬-생성하기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|projectId|query|uuid|true|Project의 고유 ID.|
|creator|query|string|false|Scene의 제작자를 지정할 수 있습니다. 사용자별 'My Assets'를 구분하는 데에 쓰이며 해당 파라미터를 포함하지 않고 호출하여 제작하는 경우 'Admin'이 제작한 것과 동일하게 취급됩니다.|
|callback|query|string|false|Scene 제작 직후에 특정 동작이 필요한 경우(해당 Scene으로 곧장 Room을 제작하는 경우 등) 포함하여 호출합니다. XRCloud 측에서의 호출은 아래와 같이 이루어집니다. |

#### Detailed descriptions

**callback**: Scene 제작 직후에 특정 동작이 필요한 경우(해당 Scene으로 곧장 Room을 제작하는 경우 등) 포함하여 호출합니다. XRCloud 측에서의 호출은 아래와 같이 이루어집니다. 

 { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sceneId }) }

> Example responses

> 200 Response

```json
{
  "sceneCreationUrl": "https://room.xrcloud.app:4000/spoke/projects/new?optId=35e75895-9db7-4eee-bae3-87e20ee156dc"
}
```

<h3 id="씬에디터(spoke)url-가져와서-씬-생성하기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|[GetSceneCreationUrlSuccessResponse](#schemagetscenecreationurlsuccessresponse)|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## 씬(Scene) 정보 가져오기

<a id="opIdGetScene"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/scenes/{sceneId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.get('/api/scenes/{sceneId}', headers = headers)

print(r.json())

```

`GET /api/scenes/{sceneId}`

<h3 id="씬(scene)-정보-가져오기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|

> Example responses

> 200 Response

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example scene name",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg",
  "sceneModificationUrl": "https://room.xrcloud.app:4000/spoke/projects/ASJCJK1?optId=35e75895-9db7-4eee-bae3-87e20ee156dc"
}
```

<h3 id="씬(scene)-정보-가져오기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|[Scene](#schemascene)|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## 씬(Scene) 삭제하기

<a id="opIdRemoveScene"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/scenes/{sceneId}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.delete('/api/scenes/{sceneId}', headers = headers)

print(r.json())

```

`DELETE /api/scenes/{sceneId}`

<h3 id="씬(scene)-삭제하기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|

> Example responses

> default Response

```json
{
  "statusCode": 400,
  "method": "Method",
  "url": "/example/endpoint",
  "body": {
    "key": "value"
  },
  "message": "Detailed error messages"
}
```

<h3 id="씬(scene)-삭제하기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|None|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="xrcloud-api-room">room</h1>

Room은 에디터(Spoke)를 통해 생성된 Scene으로 구성된 공간입니다. 

 각 Room에는 정보 요청 시마다 주소가 변하는 private room URL과 고정된 주소를 가진 public room URL이 있습니다. 이 URL들은 또한 방의 호스트에게 권한을 부여하는 host URL과 게스트 권한을 부여하는 guest URL로 구분됩니다. 

 'returnUrl'은 방을 떠날 때 돌아갈 웹 주소를 의미하며, XRCloud의 Rooms 탭에서 설정할 수 있습니다.

## 룸(Room) 생성하기

<a id="opIdCreateRoom"></a>

> Code samples

```javascript
const inputBody = '{
  "projectId": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "sceneId": "1234e5ba-5678-4f7a-86ed-abcd95ea1efg",
  "name": "example room name",
  "returnUrl": "https://www.google.com/",
  "size": 10
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/rooms',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.post('/api/rooms', headers = headers)

print(r.json())

```

`POST /api/rooms`

> Body parameter

```json
{
  "projectId": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "sceneId": "1234e5ba-5678-4f7a-86ed-abcd95ea1efg",
  "name": "example room name",
  "returnUrl": "https://www.google.com/",
  "size": 10
}
```

<h3 id="룸(room)-생성하기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|body|body|[CreateRoomRequest](#schemacreateroomrequest)|true|none|

> Example responses

> 201 Response

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example room name",
  "size": 10,
  "tags": [],
  "sceneId": "c322b49b-6e12-47d9-b293-b5ab3727459c",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "returnUrl": "https://www.google.com/",
  "roomUrl": {
    "public": {
      "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=35e75895-9db7-4eee-bae3-87e20ee156dc",
      "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=a0166051-1eee-44bb-922a-c988d517a0e1"
    },
    "private": {
      "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=fdc306b9-5129-4d83-86d5-52836afeee7e",
      "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=72dde871-33d7-4aa3-a8a9-73b8b5f0458d"
    }
  },
  "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg"
}
```

<h3 id="룸(room)-생성하기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|성공|[Room](#schemaroom)|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## 룸(Room)리스트 정보 가져오기

<a id="opIdGetRooms"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/rooms',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.get('/api/rooms', headers = headers)

print(r.json())

```

`GET /api/rooms`

해당 API는 projectId 또는 sceneId 중 하나를 필수적으로 포함하여 호출해야 합니다.

<h3 id="룸(room)리스트-정보-가져오기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|projectId|query|uuid|false|Project의 고유 ID.|
|sceneId|query|uuid|false|Scene의 고유 ID.|
|name|query|string|false|(search) 해당 이름을 가진 Object 조회.|
|userId|query|string|false|Project(app)의 사용자. Room에 입장하는 사용자를 구분하기 위해 사용됩니다.|
|avatarUrl|query|string|false|Room에서 사용할 아바타 파일의 경로.|
|linkPayload|query|string|false|Scene의 element인 'InlineView'에 전달할 값으로 InlineView에서 호출되는 URL에 hubsParam이라는 파라미터에 담겨 전달됩니다.|
|take|query|number|false|(pagination) 가져올 데이터의 갯수.|
|skip|query|number|false|(pagination) 건너뛸 데이터의 갯수.|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
      "name": "example room name",
      "size": 10,
      "tags": [],
      "sceneId": "c322b49b-6e12-47d9-b293-b5ab3727459c",
      "createdAt": "2023-07-12T09:27:41.600Z",
      "updatedAt": "2023-07-12T09:27:41.600Z",
      "returnUrl": "https://www.google.com/",
      "roomUrl": {
        "public": {
          "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=35e75895-9db7-4eee-bae3-87e20ee156dc",
          "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=a0166051-1eee-44bb-922a-c988d517a0e1"
        },
        "private": {
          "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=fdc306b9-5129-4d83-86d5-52836afeee7e",
          "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=72dde871-33d7-4aa3-a8a9-73b8b5f0458d"
        }
      },
      "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg"
    }
  ],
  "total": 0,
  "skip": 0,
  "take": 0
}
```

<h3 id="룸(room)리스트-정보-가져오기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|[GetRoomsSuccessResponse](#schemagetroomssuccessresponse)|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## 룸(Room) 정보 가져오기

<a id="opIdGetRoom"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/rooms/{roomId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.get('/api/rooms/{roomId}', headers = headers)

print(r.json())

```

`GET /api/rooms/{roomId}`

<h3 id="룸(room)-정보-가져오기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|userId|query|string|false|Project(app)의 사용자. Room에 입장하는 사용자를 구분하기 위해 사용됩니다.|
|avatarUrl|query|string|false|Room에서 사용할 아바타 파일의 경로.|
|linkPayload|query|string|false|Scene의 element인 'InlineView'에 전달할 값으로 InlineView에서 호출되는 URL에 hubsParam이라는 파라미터에 담겨 전달됩니다.|

> Example responses

> 200 Response

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example room name",
  "size": 10,
  "tags": [],
  "sceneId": "c322b49b-6e12-47d9-b293-b5ab3727459c",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "returnUrl": "https://www.google.com/",
  "roomUrl": {
    "public": {
      "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=35e75895-9db7-4eee-bae3-87e20ee156dc",
      "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=a0166051-1eee-44bb-922a-c988d517a0e1"
    },
    "private": {
      "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=fdc306b9-5129-4d83-86d5-52836afeee7e",
      "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=72dde871-33d7-4aa3-a8a9-73b8b5f0458d"
    }
  },
  "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg"
}
```

<h3 id="룸(room)-정보-가져오기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|[Room](#schemaroom)|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## 룸(Room) 정보 수정하기

<a id="opIdUpdateRoom"></a>

> Code samples

```javascript
const inputBody = '{
  "name": "example room name",
  "size": 10,
  "returnUrl": "https://www.google.com/"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/rooms/{roomId}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.patch('/api/rooms/{roomId}', headers = headers)

print(r.json())

```

`PATCH /api/rooms/{roomId}`

> Body parameter

```json
{
  "name": "example room name",
  "size": 10,
  "returnUrl": "https://www.google.com/"
}
```

<h3 id="룸(room)-정보-수정하기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|body|body|[UpdateRoomRequest](#schemaupdateroomrequest)|true|none|

> Example responses

> 200 Response

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example room name",
  "size": 10,
  "tags": [],
  "sceneId": "c322b49b-6e12-47d9-b293-b5ab3727459c",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "returnUrl": "https://www.google.com/",
  "roomUrl": {
    "public": {
      "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=35e75895-9db7-4eee-bae3-87e20ee156dc",
      "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=a0166051-1eee-44bb-922a-c988d517a0e1"
    },
    "private": {
      "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=fdc306b9-5129-4d83-86d5-52836afeee7e",
      "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=72dde871-33d7-4aa3-a8a9-73b8b5f0458d"
    }
  },
  "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg"
}
```

<h3 id="룸(room)-정보-수정하기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|[Room](#schemaroom)|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## 룸(Room) 삭제하기

<a id="opIdRemoveRoom"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/rooms/{roomId}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.delete('/api/rooms/{roomId}', headers = headers)

print(r.json())

```

`DELETE /api/rooms/{roomId}`

<h3 id="룸(room)-삭제하기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|

> Example responses

> default Response

```json
{
  "statusCode": 400,
  "method": "Method",
  "url": "/example/endpoint",
  "body": {
    "key": "value"
  },
  "message": "Detailed error messages"
}
```

<h3 id="룸(room)-삭제하기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|None|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## 룸(Room) 로그 가져오기

<a id="opIdGetRoomLogs"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'X-XRCLOUD-API-KEY':'string'
};

fetch('/api/rooms/{roomId}/logs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-XRCLOUD-API-KEY': 'string'
}

r = requests.get('/api/rooms/{roomId}/logs', headers = headers)

print(r.json())

```

`GET /api/rooms/{roomId}/logs`

특정 방에 대한 사용자의 참여 로그를 가져옵니다. 이 로그는 사용자가 방에 참여한 시간, IP 주소, 장치 정보 등을 포함합니다.(2024-12-01 현재 ip주소와 userAgent는 제대로 전송되고 있지 않습니다.)

<h3 id="룸(room)-로그-가져오기-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|헤더에 다음과 같은 형태로 인증 키를 포함시켜야합니다. `X-XRCLOUD-API-KEY: ${ApiKey}`.|

> Example responses

> 200 Response

```json
[
  {
    "code": "room-join",
    "resourceId": "cfdd7716-4ed0-4db2-b7d6-93dc0ff72c2a",
    "sessionId": "6dfbc23a-4193-4979-adde-e984f40fd80a",
    "reticulumId": "1900346259722469400",
    "logTime": "2024-11-29T08:54:27.000Z",
    "action": "hubs join",
    "ip": "0.0.0.0",
    "userAgent": "",
    "device": "unknown/pc",
    "id": 17
  }
]
```

> default Response

```json
{
  "statusCode": 400,
  "method": "Method",
  "url": "/example/endpoint",
  "body": {
    "key": "value"
  },
  "message": "Detailed error messages"
}
```

<h3 id="룸(room)-로그-가져오기-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|성공|[GetRoomLogsSuccessResponse](#schemagetroomlogssuccessresponse)|
|default|Default|상황에 따라 4XX 또는 5XX 오류가 발생할 수 있습니다|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_ErrorResponse">ErrorResponse</h2>
<!-- backwards compatibility -->
<a id="schemaerrorresponse"></a>
<a id="schema_ErrorResponse"></a>
<a id="tocSerrorresponse"></a>
<a id="tocserrorresponse"></a>

```json
{
  "statusCode": 400,
  "method": "Method",
  "url": "/example/endpoint",
  "body": {
    "key": "value"
  },
  "message": "Detailed error messages"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|statusCode|number|false|none|HTTP 상태 코드. 실제 값은 오류에 따라 달라집니다.|
|method|string|false|none|오류를 일으킨 요청의 HTTP 메서드입니다.|
|url|string|false|none|이 오류를 반환한 엔드포인트. 이 값은 엔드포인트에 따라 달라집니다.|
|body|object|false|none|오류를 일으킨 요청 본문에 전송된 원본 데이터. 실제 값은 요청에 따라 달라집니다.|
|message|string|false|none|오류를 설명하는 자세한 오류 메시지.|

<h2 id="tocS_Project">Project</h2>
<!-- backwards compatibility -->
<a id="schemaproject"></a>
<a id="schema_Project"></a>
<a id="tocSproject"></a>
<a id="tocsproject"></a>

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example project name",
  "webhookUrl": "https://api.example.com/webhook",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "faviconUrl": "https://api.xrcloud.app/favicon/4a3/4a3e946e-2776-4182-afb7-204d982b727d.ico",
  "logoUrl": "https://api.xrcloud.app/favicon/51d/51dc73cc-36db-4046-af8d-1e61e4b59c19.jpg"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|(projectId) Project의 고유 ID.|
|name|string|false|none|Project의 이름.|
|webhookUrl|string|false|none|사용자의 Room/Scene 활동 로그를 전송받을 webhook URL입니다. 이 URL로 다음과 같은 이벤트 발생 시 로그가 POST 요청으로 전송됩니다:<br><br>**Room 관련 이벤트**<br>- room-join: 사용자가 Room에 입장<br>- room-exit: 사용자가 Room에서 퇴장<br>- room-video-click-event: Room 내 비디오 클릭 이벤트<br><br>**Scene 관련 이벤트**<br>- scene-created: Scene 생성<br>- scene-updated: Scene 수정<br><br>**Webhook 요청 데이터 형식**<br>```json<br>{<br>  "code": "room-join",              // 이벤트 코드<br>  "resourceId": "uuid",            // Room/Scene의 ID<br>  "sessionId": "uuid",             // 세션 ID<br>  "reticulumId": "string",         // XRCLOUD(Hubs)의 사용자 ID<br>  "logTime": "2024-01-01T00:00:00Z", // 이벤트 발생 시간<br>  "action": "string",              // 이벤트 액션 정보<br>  "ip": "string",                  // 사용자 IP<br>  "userAgent": "string",           // 사용자 브라우저 정보<br>  "device": "string"               // 사용자 디바이스 정보 (pc/mobile/vr)<br>}```<br><br>**참고**: 현재 ip와 userAgent 값은 제대로 전송되지 않을 수 있습니다.|
|createdAt|string(date-time)|false|none|Project가 생성된 날짜와 시간.|
|updatedAt|string(date-time)|false|none|Project가 마지막으로 업데이트된 날짜와 시간.|
|faviconUrl|string|false|none|Project의 파비콘 URL.|
|logoUrl|string|false|none|Project의 로고의 URL.|

<h2 id="tocS_Scene">Scene</h2>
<!-- backwards compatibility -->
<a id="schemascene"></a>
<a id="schema_Scene"></a>
<a id="tocSscene"></a>
<a id="tocsscene"></a>

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example scene name",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg",
  "sceneModificationUrl": "https://room.xrcloud.app:4000/spoke/projects/ASJCJK1?optId=35e75895-9db7-4eee-bae3-87e20ee156dc"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|(sceneId) Scene의 고유 ID.|
|name|string|false|none|Scene의 이름.|
|createdAt|string(date-time)|false|none|Scene이 생성된 날짜와 시간.|
|updatedAt|string(date-time)|false|none|Scene이 마지막으로 업데이트된 날짜와 시간.|
|thumbnailUrl|string|false|none|Scene의 thumbnail URL.|
|sceneModificationUrl|string|false|none|Scene을 수정할 공간의 URL.|

<h2 id="tocS_Room">Room</h2>
<!-- backwards compatibility -->
<a id="schemaroom"></a>
<a id="schema_Room"></a>
<a id="tocSroom"></a>
<a id="tocsroom"></a>

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example room name",
  "size": 10,
  "tags": [],
  "sceneId": "c322b49b-6e12-47d9-b293-b5ab3727459c",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "returnUrl": "https://www.google.com/",
  "roomUrl": {
    "public": {
      "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=35e75895-9db7-4eee-bae3-87e20ee156dc",
      "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=a0166051-1eee-44bb-922a-c988d517a0e1"
    },
    "private": {
      "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=fdc306b9-5129-4d83-86d5-52836afeee7e",
      "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=72dde871-33d7-4aa3-a8a9-73b8b5f0458d"
    }
  },
  "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|(roomId) Room의 고유 ID.|
|name|string|false|none|Room의 이름.|
|size|number|false|none|Room에 입장할 수 있는 최대 인원 수.|
|tags|array|false|none|(Before Use) 특정 Room을 구분하기 위한 필드.|
|sceneId|string|false|none|Scene의 ID(uuid).|
|createdAt|string(date-time)|false|none|Room이 생성된 날짜와 시간.|
|updatedAt|string(date-time)|false|none|Room을 마지막으로 업데이트한 날짜와 시간.|
|returnUrl|string|false|none|Room 퇴장 시 돌아갈 URL.|
|roomUrl|object|false|none|Room 입장 URL.|
|» public|object|false|none|값이 변하지 않는 공개 URL로 접근하는 유저의 구분이 불가.|
|»» host|string|false|none|호스트의 Room URL.|
|»» guest|string|false|none|게스트의 Room URL.|
|» private|object|false|none|'Get Room'을 통해 URL을 얻을 때마다 변하는 URL로 접근하는 유저의 구분이 가능.|
|»» host|string|false|none|호스트의 Room URL.|
|»» guest|string|false|none|게스트의 Room URL.|
|thumbnailUrl|string|false|none|Room의 thumbnail URL.|

<h2 id="tocS_GetScenesSuccessResponse">GetScenesSuccessResponse</h2>
<!-- backwards compatibility -->
<a id="schemagetscenessuccessresponse"></a>
<a id="schema_GetScenesSuccessResponse"></a>
<a id="tocSgetscenessuccessresponse"></a>
<a id="tocsgetscenessuccessresponse"></a>

```json
{
  "items": [
    {
      "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
      "name": "example scene name",
      "createdAt": "2023-07-12T09:27:41.600Z",
      "updatedAt": "2023-07-12T09:27:41.600Z",
      "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg",
      "sceneModificationUrl": "https://room.xrcloud.app:4000/spoke/projects/ASJCJK1?optId=35e75895-9db7-4eee-bae3-87e20ee156dc"
    }
  ],
  "total": 0,
  "skip": 0,
  "take": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[Scene](#schemascene)]|false|none|Scene의 목록.|
|total|number|false|none|총 Scene의 갯수.|
|skip|number|false|none|Pagination을 위해 건너뛴 항목 수.|
|take|number|false|none|Pagination을 적용해 가져온 항목 수.|

<h2 id="tocS_GetSceneCreationUrlSuccessResponse">GetSceneCreationUrlSuccessResponse</h2>
<!-- backwards compatibility -->
<a id="schemagetscenecreationurlsuccessresponse"></a>
<a id="schema_GetSceneCreationUrlSuccessResponse"></a>
<a id="tocSgetscenecreationurlsuccessresponse"></a>
<a id="tocsgetscenecreationurlsuccessresponse"></a>

```json
{
  "sceneCreationUrl": "https://room.xrcloud.app:4000/spoke/projects/new?optId=35e75895-9db7-4eee-bae3-87e20ee156dc"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|sceneCreationUrl|string|false|none|Scene을 생성할 공간의 URL.|

<h2 id="tocS_CreateRoomRequest">CreateRoomRequest</h2>
<!-- backwards compatibility -->
<a id="schemacreateroomrequest"></a>
<a id="schema_CreateRoomRequest"></a>
<a id="tocScreateroomrequest"></a>
<a id="tocscreateroomrequest"></a>

```json
{
  "projectId": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "sceneId": "1234e5ba-5678-4f7a-86ed-abcd95ea1efg",
  "name": "example room name",
  "returnUrl": "https://www.google.com/",
  "size": 10
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|projectId|uuid|true|none|Project의 고유 ID.|
|sceneId|uuid|true|none|Scene의 고유 ID.|
|name|string|true|none|Room의 이름.|
|returnUrl|string|true|none|Room 퇴장 시 돌아갈 URL.|
|size|number|false|none|Room에 입장할 수 있는 최대 인원 수.|

<h2 id="tocS_GetRoomsSuccessResponse">GetRoomsSuccessResponse</h2>
<!-- backwards compatibility -->
<a id="schemagetroomssuccessresponse"></a>
<a id="schema_GetRoomsSuccessResponse"></a>
<a id="tocSgetroomssuccessresponse"></a>
<a id="tocsgetroomssuccessresponse"></a>

```json
{
  "items": [
    {
      "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
      "name": "example room name",
      "size": 10,
      "tags": [],
      "sceneId": "c322b49b-6e12-47d9-b293-b5ab3727459c",
      "createdAt": "2023-07-12T09:27:41.600Z",
      "updatedAt": "2023-07-12T09:27:41.600Z",
      "returnUrl": "https://www.google.com/",
      "roomUrl": {
        "public": {
          "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=35e75895-9db7-4eee-bae3-87e20ee156dc",
          "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?public=a0166051-1eee-44bb-922a-c988d517a0e1"
        },
        "private": {
          "host": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=fdc306b9-5129-4d83-86d5-52836afeee7e",
          "guest": "https://room.xrcloud.app:4000/7UizZDL/example-room-name?private=72dde871-33d7-4aa3-a8a9-73b8b5f0458d"
        }
      },
      "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg"
    }
  ],
  "total": 0,
  "skip": 0,
  "take": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[Room](#schemaroom)]|false|none|Room의 목록.|
|total|number|false|none|총 Room의 갯수.|
|skip|number|false|none|Pagination을 위해 건너뛴 항목 수.|
|take|number|false|none|Pagination을 적용해 가져온 항목 수.|

<h2 id="tocS_GetRoomLogsSuccessResponse">GetRoomLogsSuccessResponse</h2>
<!-- backwards compatibility -->
<a id="schemagetroomlogssuccessresponse"></a>
<a id="schema_GetRoomLogsSuccessResponse"></a>
<a id="tocSgetroomlogssuccessresponse"></a>
<a id="tocsgetroomlogssuccessresponse"></a>

```json
[
  {
    "code": "room-join",
    "resourceId": "c322b49b-6e12-47d9-b293-b5ab3727459c",
    "sessionId": "4f7edfb6-b8a1-4f58-96ee-1deb4da98740",
    "reticulumId": "0934212312120",
    "logTime": "2023-12-12T09:27:41.600Z",
    "action": "enter",
    "ip": "123.0.0.1",
    "userAgent": "Mozilla/5.0",
    "device": "VR"
  }
]

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|code|string|false|none|이벤트 코드 (room-join, room-exit 등)|
|resourceId|string|false|none|Room의 ID|
|sessionId|string|false|none|세션의 고유 ID|
|reticulumId|string|false|none|XRCLOUD(Hubs)의 사용자 ID|
|logTime|string(date-time)|false|none|이벤트 발생 시간|
|action|string|false|none|이벤트 액션 정보|
|ip|string|false|none|사용자 IP 주소|
|userAgent|string|false|none|사용자 브라우저 정보|
|device|string|false|none|사용자 디바이스 정보 (pc/mobile/vr)|

<h2 id="tocS_UpdateRoomRequest">UpdateRoomRequest</h2>
<!-- backwards compatibility -->
<a id="schemaupdateroomrequest"></a>
<a id="schema_UpdateRoomRequest"></a>
<a id="tocSupdateroomrequest"></a>
<a id="tocsupdateroomrequest"></a>

```json
{
  "name": "example room name",
  "size": 10,
  "returnUrl": "https://www.google.com/"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|Room의 이름.|
|size|number|false|none|Room에 입장할 수 있는 최대 인원 수.|
|returnUrl|string|false|none|Room 퇴장 시 돌아갈 URL.|

