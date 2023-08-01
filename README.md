## Description

이 문서는 nestjs, redis, grpc, 그리고 typeorm을 사용한 프로그래밍에 대해 설명합니다.

## Prerequisites

프로젝트를 실행하기 전에 Node.js가 설치되어 있어야 합니다. 이 프로젝트는 최신 LTS 버전의 Node.js를 사용하므로, 최신 LTS 버전을 설치하는 것이 좋습니다.

## Installation

```bash
$ npm install
```

NPM 패키지를 설치합니다. 설치가 완료되면, 프로젝트를 실행하거나 빌드할 준비가 됩니다.

## Running Development Environment

```bash
npm run infra:up
npm start
npm test
```

위의 스크립트를 실행하면 개발 환경이 시작됩니다. NestJS 애플리케이션을 디버그 모드로 시작하며, 파일 변경을 감지하여 자동으로 재시작합니다.

테스트는 Jest를 사용하여 실행됩니다. 테스트 실행 중에 파일이 변경되면 Jest는 변경된 파일에 대한 테스트만 재실행합니다. 테스트 커버리지 보고서를 생성하려면 npm run test:all을 실행하세요.

@DEV_TEST_LOG 파일을 생성하면 테스트 로그를 출력할 수 있습니다.

jest를 실행했을 때 아래처럼 에러가 발생하면 아래의 스크립트를 실행한다.

참고 https://code.visualstudio.com/docs/setup/linux#_visual-studio-code-is-unable-to-watch-for-file-changes-in-this-large-workspace-error-enospc

```sh
# Error: ENOSPC: System limit for number of file watchers reached, watch '/workspaces/nestjs-ex/src'

echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## Debugging

`npm start`를 실행하여 프로세스에 연결할 수 있습니다.

vscode에 Jest Runner 및 code lens 확장 프로그램이 설치되어 있는 경우, unit tests에 대한 Run|Debug 메뉴가 표시됩니다.