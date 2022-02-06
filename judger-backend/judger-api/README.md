# 충북대학교 SW중심대학사업단 Backend

## 환경 구성

1. Node.js v14+
2. MongDB v4.4.x

## NPM 패키지 설치

```shell
$ npm i
```

## Google Gmail API 활성화 및 토큰 발급
.env-help 파일에서 관련 내용 참고

## 주소 및 좌표 검색 API 키 발급
[도로명주소 API](https://www.juso.go.kr) 에 접속하여 오픈소스 API 중 도로명주소 API와 좌표제공 API를 신청하여 API 키를 발급받을 것

## .env 파일 작성
.env-help의 내용을 생성한 .env 파일에 붙여넣고 비어 있는 항목(<> 안의 내용)을 채워 넣을 것

## JWT 관련 Key 파일 생성

다음의 key 파일들을 생성하고 생성된 파일에 public key와 private key를 [여기](http://travistidwell.com/jsencrypt/demo/) 에서 생성하여 붙여넣을 것
(Key Size는 512로 할 것)

- access-token.private.key
- access-token.public.key
- refresh-token.private.key
- refresh-token.public.key

## 실행
### 개발용 실행
#### 인증 서버 실행
```shell
$ npm run dev:auth
```
#### API 서버 실행
```shell
$ npm run dev:api
```
#### 업로드 서버 실행
```shell
$ npm run dev:upload
```
#### 전체 서버 실행
```shell
$ npm run dev
```

### 배포용 실행
#### 인증 서버 시작
```shell
$ npm run start:auth
```
#### API 서버 시작
```shell
$ npm run start:api
```
#### 업로드 서버 시작
```shell
$ npm run start:upload
```
#### 인증 서버 중지
```shell
$ npm run stop:auth
```
#### API 서버 중지
```shell
$ npm run stop:api
```
#### 업로드 서버 중지
```shell
$ npm run stop:upload
```
#### 인증 서버 재시작
```shell
$ npm run restart:auth
```
#### API 서버 재시작
```shell
$ npm run restart:api
```
#### 업로드 서버 재시작
```shell
$ npm run restart:upload
```
#### 전체 서버 시작
```shell
$ npm start
```
#### 전체 서버 중지
```shell
$ npm run stop
```
#### 전체 서버 재시작
```shell
$ npm run restart
```


