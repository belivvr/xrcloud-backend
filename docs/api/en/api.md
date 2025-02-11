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

A Project in XRCLOUD can be a developer's project, platform, or 3rd-party application. It serves as a management unit for Scenes and Rooms, where multiple Scenes and Rooms can belong to a specific Project.

## Retrieve Projects by Label

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

Fetch projects filtered by label. Use the `label` query parameter to filter projects by a specific label.

<h3 id="retrieve-projects-by-label-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|label|query|string|false|The label of the project to filter. If not provided, all projects will be returned.|

> Example responses

> 200 Response

```json
[
  {
    "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
    "name": "example project name",
    "webhookUrl": "https://api.xrcloud.app/events/webhook",
    "createdAt": "2023-07-12T09:27:41.600Z",
    "updatedAt": "2023-07-12T09:27:41.600Z",
    "faviconUrl": "https://api.xrcloud.app/storage/favicon/4a3/4a3e946e-2776-4182-afb7-204d982b727d.ico",
    "logoUrl": "https://api.xrcloud.app/storage/favicon/51d/51dc73cc-36db-4046-af8d-1e61e4b59c19.jpg"
  }
]
```

<h3 id="retrieve-projects-by-label-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|Inline|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<h3 id="retrieve-projects-by-label-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Project](#schemaproject)]|false|none|none|
|» id|string|false|none|(projectId) Unique ID of the Project.|
|» name|string|false|none|Name of the Project.|
|» webhookUrl|string|false|none|The endpoint of the external system that sends event information when a user enters or exits the Room. The Room enter/exit information will be sent as a POST request to the URL. You can use this value to record the user's activity. <br>  Note: As of 2024-12-01, the IP and UserAgent values are not being sent correctly. <br><br> Example: <br><br> ```json<br> {<br>   "code": "room-join",<br>   "resourceId": "c322b49b-6e12-47d9-b293-b5ab3727459c",<br>   "sessionId": "4f7edfb6-b8a1-4f58-96ee-1deb4da98740",<br>   "reticulumId": "0934212312120(XRCLOUD's user ID for getRoom, the userId will be created.)",<br>   "logTime": "2023-12-12T09:27:41.600Z",<br>   "action": "enter",<br>   "ip": "123.0.0.1",<br>   "userAgent": "Mozilla/5.0",<br>   "device": "VR"<br> }<br> ```|
|» createdAt|string(date-time)|false|none|Date and time when the Project was created.|
|» updatedAt|string(date-time)|false|none|Date and time when the Project was last updated.|
|» faviconUrl|string|false|none|URL of the favicon of the Project.|
|» logoUrl|string|false|none|URL of the logo of the Project.|

<aside class="success">
This operation does not require authentication
</aside>

## Create a Project

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

You can create a project using the following format:

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

This API uses `multipart/form-data` format to include the favicon, logo, name, and label of the project.

> Body parameter

```yaml
favicon: string
logo: string
name: string
label: string

```

<h3 id="create-a-project-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» favicon|body|string(binary)|false|Favicon file for the project.|
|» logo|body|string(binary)|false|Logo file for the project.|
|» name|body|string|false|Name of the project.|
|» label|body|string|false|Label of the project.|

> Example responses

> 201 Response

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example project name",
  "webhookUrl": "https://api.xrcloud.app/events/webhook",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "faviconUrl": "https://api.xrcloud.app/storage/favicon/4a3/4a3e946e-2776-4182-afb7-204d982b727d.ico",
  "logoUrl": "https://api.xrcloud.app/storage/favicon/51d/51dc73cc-36db-4046-af8d-1e61e4b59c19.jpg"
}
```

<h3 id="create-a-project-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|The project was successfully created.|[Project](#schemaproject)|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## Retrieve or Generate XRCLOUD User ID

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

Pass a user ID from your service to generate and retrieve a reticulumId (XRCLOUD's user ID) in XRCLOUD. This user ID is used in other APIs to identify specific user actions on the platform. Logging information will be reported using this reticulumId.

<h3 id="retrieve-or-generate-xrcloud-user-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|projectId|path|string|true|Unique ID of the project.|
|accountId|path|string|true|Account ID of the user.|

> Example responses

> 200 Response

```json
{}
```

<h3 id="retrieve-or-generate-xrcloud-user-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successfully retrieved user ID.|Inline|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<h3 id="retrieve-or-generate-xrcloud-user-id-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## Retrieve Project Information

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

<h3 id="retrieve-project-information-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|

> Example responses

> 200 Response

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example project name",
  "webhookUrl": "https://api.xrcloud.app/events/webhook",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "faviconUrl": "https://api.xrcloud.app/storage/favicon/4a3/4a3e946e-2776-4182-afb7-204d982b727d.ico",
  "logoUrl": "https://api.xrcloud.app/storage/favicon/51d/51dc73cc-36db-4046-af8d-1e61e4b59c19.jpg"
}
```

<h3 id="retrieve-project-information-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|[Project](#schemaproject)|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="xrcloud-api-scene">scene</h1>

A space for creating web-based 3D virtual environments that are required for Room creation. 

 To create a Scene, call the [get-creation-url api](#operation/GetSceneCreationUrl) to obtain the 'sceneCreationUrl', access the editor (Spoke), and click the Publish Scene button in the upper right corner. You can also modify existing Scenes by accessing the 'sceneModificationUrl' field obtained from the [get-scene api](#operation/GetScene). 

 - The `optId` value is a callback value used by XRCLOUD to verify Scene creation and modification. Modifying it may cause errors.

## Retrieve Scene List Information

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

<h3 id="retrieve-scene-list-information-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|projectId|query|uuid|true|Unique ID of the Project.|
|name|query|string|false|(search) Retrieve objects with the specified name.|
|creator|query|string|false|(search) Retrieve objects created by a specific creator.|
|take|query|number|false|(pagination) The number of items to retrieve.|
|skip|query|number|false|(pagination) The number of items to skip.|

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

<h3 id="retrieve-scene-list-information-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|[GetScenesSuccessResponse](#schemagetscenessuccessresponse)|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## Retrieve Scene Editor (Spoke) URL

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

<h3 id="retrieve-scene-editor-(spoke)-url-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|projectId|query|uuid|true|Unique ID of the Project.|
|creator|query|string|false|You can specify the creator of the Scene. It is used to distinguish between 'My Assets' for each user. If you call without this parameter, it will be treated as if it was created by 'Admin'.|
|callback|query|string|false|You can call this if you need a specific action after creating the Scene (such as creating a Room immediately after creating the Scene). The call from XRCloud will be as follows. |

#### Detailed descriptions

**callback**: You can call this if you need a specific action after creating the Scene (such as creating a Room immediately after creating the Scene). The call from XRCloud will be as follows. 

 { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sceneId }) }

> Example responses

> 200 Response

```json
{
  "sceneCreationUrl": "https://room.xrcloud.app:4000/spoke/projects/new?optId=35e75895-9db7-4eee-bae3-87e20ee156dc"
}
```

<h3 id="retrieve-scene-editor-(spoke)-url-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|[GetSceneCreationUrlSuccessResponse](#schemagetscenecreationurlsuccessresponse)|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## Retrieve Scene Information

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

<h3 id="retrieve-scene-information-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|

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

<h3 id="retrieve-scene-information-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|[Scene](#schemascene)|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## Remove a Scene

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

<h3 id="remove-a-scene-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|

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

<h3 id="remove-a-scene-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|None|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="xrcloud-api-room">room</h1>

A Room is a virtual space based on a Scene created through the editor (Spoke). 

 Each Room provides two types of URLs: a private room URL that changes with each request and a public room URL with a fixed address. These URLs are further divided into host URLs that grant host permissions and guest URLs that grant guest permissions. 

 The 'returnUrl' specifies the web address to return to when leaving the room, which can be configured in the Rooms tab of XRCloud.

## Create a Room

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

<h3 id="create-a-room-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|
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

<h3 id="create-a-room-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Success|[Room](#schemaroom)|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## Retrieve Room List Information

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

This API must include either projectId or sceneId.

<h3 id="retrieve-room-list-information-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|projectId|query|uuid|false|Unique ID of the Project.|
|sceneId|query|uuid|false|Unique ID of the Scene.|
|name|query|string|false|(search) Retrieve objects with the specified name.|
|userId|query|string|false|User of the Project (app). It is used to distinguish between users who enter the Room.|
|avatarUrl|query|string|false|The path to the avatar file for the Room.|
|linkPayload|query|string|false|The value to be passed to the 'InlineView' element of the Scene. It will be passed to the URL called by the InlineView in the hubsParam parameter.|
|take|query|number|false|(pagination) The number of items to retrieve.|
|skip|query|number|false|(pagination) The number of items to skip.|

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

<h3 id="retrieve-room-list-information-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|[GetRoomsSuccessResponse](#schemagetroomssuccessresponse)|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## Retrieve Room Information

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

<h3 id="retrieve-room-information-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|
|userId|query|string|false|User of the Project (app). It is used to distinguish between users who enter the Room.|
|avatarUrl|query|string|false|The path to the avatar file for the Room.|
|linkPayload|query|string|false|The value to be passed to the 'InlineView' element of the Scene. It will be passed to the URL called by the InlineView in the hubsParam parameter.|

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

<h3 id="retrieve-room-information-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|[Room](#schemaroom)|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## Update Room Information

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

<h3 id="update-room-information-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|
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

<h3 id="update-room-information-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|[Room](#schemaroom)|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## Remove a Room

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

<h3 id="remove-a-room-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|

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

<h3 id="remove-a-room-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|None|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## Retrieve Room Logs

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

Retrieve the user's participation logs for a specific room. This log includes the time, IP address, device information, etc. of the user who joined the room. (As of 2024-12-01, the IP address and UserAgent are not being sent correctly.)

<h3 id="retrieve-room-logs-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|X-XRCLOUD-API-KEY|header|string|true|You must include the `ApiKey` in the header in the following format: `X-XRCLOUD-API-KEY: ${ApiKey}`.|

> Example responses

> 200 Response

```json
[
  {
    "code": "room-join",
    "roomId": "cfdd7716-4ed0-4db2-b7d6-93dc0ff72c2a",
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

<h3 id="retrieve-room-logs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success|[GetRoomLogsSuccessResponse](#schemagetroomlogssuccessresponse)|
|default|Default|Errors such as 4XX or 5XX may occur depending on the situation.|[ErrorResponse](#schemaerrorresponse)|

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
|statusCode|number|false|none|HTTP status code. The actual value varies depending on the error.|
|method|string|false|none|HTTP method of the request that caused the error.|
|url|string|false|none|The endpoint that returned this error. This value varies depending on the endpoint.|
|body|object|false|none|The original data sent in the request body. The actual value varies depending on the request.|
|message|string|false|none|Detailed error message explaining the error.|

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
  "webhookUrl": "https://api.xrcloud.app/events/webhook",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "faviconUrl": "https://api.xrcloud.app/storage/favicon/4a3/4a3e946e-2776-4182-afb7-204d982b727d.ico",
  "logoUrl": "https://api.xrcloud.app/storage/favicon/51d/51dc73cc-36db-4046-af8d-1e61e4b59c19.jpg"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|(projectId) Unique ID of the Project.|
|name|string|false|none|Name of the Project.|
|webhookUrl|string|false|none|The endpoint of the external system that sends event information when a user enters or exits the Room. The Room enter/exit information will be sent as a POST request to the URL. You can use this value to record the user's activity. <br>  Note: As of 2024-12-01, the IP and UserAgent values are not being sent correctly. <br><br> Example: <br><br> ```json<br> {<br>   "code": "room-join",<br>   "resourceId": "c322b49b-6e12-47d9-b293-b5ab3727459c",<br>   "sessionId": "4f7edfb6-b8a1-4f58-96ee-1deb4da98740",<br>   "reticulumId": "0934212312120(XRCLOUD's user ID for getRoom, the userId will be created.)",<br>   "logTime": "2023-12-12T09:27:41.600Z",<br>   "action": "enter",<br>   "ip": "123.0.0.1",<br>   "userAgent": "Mozilla/5.0",<br>   "device": "VR"<br> }<br> ```|
|createdAt|string(date-time)|false|none|Date and time when the Project was created.|
|updatedAt|string(date-time)|false|none|Date and time when the Project was last updated.|
|faviconUrl|string|false|none|URL of the favicon of the Project.|
|logoUrl|string|false|none|URL of the logo of the Project.|

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
|id|string|false|none|(sceneId) Unique ID of the Scene.|
|name|string|false|none|Name of the Scene.|
|createdAt|string(date-time)|false|none|Date and time when the Scene was created.|
|updatedAt|string(date-time)|false|none|Date and time when the Scene was last updated.|
|thumbnailUrl|string|false|none|Thumbnail URL of the Scene.|
|sceneModificationUrl|string|false|none|URL of the space to modify the Scene.|

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
|id|string|false|none|(roomId) Unique ID of the Room.|
|name|string|false|none|Name of the Room.|
|size|number|false|none|Maximum number of people that can enter the Room.|
|tags|array|false|none|(Before Use) Field to distinguish specific Rooms.|
|sceneId|string|false|none|ID of the Scene (uuid).|
|createdAt|string(date-time)|false|none|Date and time when the Room was created.|
|updatedAt|string(date-time)|false|none|Date and time when the Room was last updated.|
|returnUrl|string|false|none|URL to return to when leaving the Room.|
|roomUrl|object|false|none|Room entry URL.|
|» public|object|false|none|Users cannot distinguish between URLs that do not change. Users cannot distinguish between URLs that do not change.|
|»» host|string|false|none|Room URL of the host.|
|»» guest|string|false|none|Room URL of the guest.|
|» private|object|false|none|Users can distinguish between URLs that change with each request to get the URL. Users can distinguish between URLs that change with each request to get the URL.|
|»» host|string|false|none|Room URL of the host.|
|»» guest|string|false|none|Room URL of the guest.|
|thumbnailUrl|string|false|none|Thumbnail URL of the Room.|

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
|items|[[Scene](#schemascene)]|false|none|List of Scenes.|
|total|number|false|none|Total number of Scenes.|
|skip|number|false|none|Number of items skipped for pagination.|
|take|number|false|none|Number of items retrieved for pagination.|

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
|sceneCreationUrl|string|false|none|URL of the space to create the Scene.|

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
|projectId|uuid|true|none|Unique ID of the Project.|
|sceneId|uuid|true|none|Unique ID of the Scene.|
|name|string|true|none|Name of the Room.|
|returnUrl|string|true|none|URL to return to when leaving the Room.|
|size|number|false|none|Maximum number of people that can enter the Room.|

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
|items|[[Room](#schemaroom)]|false|none|List of Rooms.|
|total|number|false|none|Total number of Rooms.|
|skip|number|false|none|Number of items skipped for pagination.|
|take|number|false|none|Number of items retrieved for pagination.|

<h2 id="tocS_GetRoomLogsSuccessResponse">GetRoomLogsSuccessResponse</h2>
<!-- backwards compatibility -->
<a id="schemagetroomlogssuccessresponse"></a>
<a id="schema_GetRoomLogsSuccessResponse"></a>
<a id="tocSgetroomlogssuccessresponse"></a>
<a id="tocsgetroomlogssuccessresponse"></a>

```json
{
  "id": "77",
  "infraUserId": "user@domain.com",
  "roomId": "1234e5ba-5678-4f7a-86ed-abcd95ea1efg",
  "sessionId": "4f7edfb6-b8a1-4f58-96ee-1deb4da98740",
  "joinedAt": "2023-12-12T09:27:41.600Z",
  "exitedAt": "2023-12-12T09:30:41.600Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|number|false|none|Unique ID of the entrance/exit log.|
|infraUserId|uuid|false|none|User ID of the 3rd-party application that entered the Room.|
|roomId|uuid|false|none|Unique ID of the Room.|
|sessionId|uuid|false|none|Unique ID of the Session.|
|joinedAt|string(date-time)|false|none|Date and time when the user entered the Room.|
|exitedAt|string(date-time)|false|none|Date and time when the user exited the Room.|

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
|name|string|false|none|Name of the Room.|
|size|number|false|none|Maximum number of people that can enter the Room.|
|returnUrl|string|false|none|URL to return to when leaving the Room.|

