#CBNU Online Judger System
######by Chungbuk National University Sw7up Center
######Special Thanks To Prof. K.M.Ahn
***

######Specs - Node, Express, Angular, Kafka, Zookeeper, MongoDB, Docker, Nginx, PM2

***

##INFO

####충북대학교 산하 소프트웨어중심 사업단에서 학생들의 소프트웨어 실력 향상 및 대회, 과제 제출용으로 제작한 OJ(Online Judger) 입니다. Judger 엔진은 중국 Qingdao 대학의 OJ 엔진을 사용했으며 웹과 서버는 독자 개발입니다. 웹은 Angular 기반, API서버는 Express 기반입니다. 과부하를 줄이기 위해 5대의 Judger 서버를 도커로 묶었으며 Apache Kafka를 통해 분산처리 합니다. Kafka는 4개의 파티션을 사용하며 1대는 엔진 다운 시 리밸런싱을 위한 보조 서버입니다.

##실행법

###개발버전

1. 도커를 설치한다.

2. env파일을 설정한다.
- 웹: judger-web 내부 projects/main/src/environments/environment.ts 파일 설명 따라 작성
- API서버: judger-api 내부 .env 파일 생성후 .env-help에 따라 설정
- Judger: judger 내부 .env 생성 후 .env-help에 따라 작성
3. 인증서버를 실행한다.
   (https://github.com/cbnusw/sw7up-backend)

4. docker-compose -f docker-compose-cluster_dev.yml up 으로 실행한다.

5. Kafka가 정상적으로 파티션을 가지고 있는지 확인한다.
- swjudge_submit: 파티션 4개
- swjudge_result: 파티션 4개
- 만약 없거나 파티션의 수가 맞지 않는다면 수정한다.
- 파티션 수정 명령어: --alter, 파티션 생성 명령어: --create, 부트스트랩서버 주소: kafka:9092
- 수정이 일어나고 난 후엔 API서버와 Judger를 다시 실행시켜준다. Nodemon 환경이기에 변경점 수정 후 저장해주면 재시작된다.
6. localhost:4200으로 접속한다.

###배포버전

1. 위 개발 설정을 중 1, 2(배포용 설정 적용)를 시행한다.
2. judger-web 내부 nginx에서 nginx설정 및 ssl폴더 설정 후 key파일을 설정, 도커파일 내부 nginx 설정을 서버 환경에 맞춘다.
3. docker compose up으로 실행한다.
4. 개발 설정 중 5번을 시행 후 변경점이 있다면 해당 컨테이너로 접속해 pm2 reload 0 명령어로 API서버 재시작해준다.

###중요사항
- 카프카 설정이 옳은지 항상 확인한다.
- 기타 퍼블리싱 사양이 맞는지 항상 확인한다.
- 카프카 및 주키퍼의 메모리 설정은 항상 넉넉하게 한다(8기가 이상).
***

##RELEASE NOTE

###V 1.2.4
- 컴파일 언어 JS 추가 (Nodejs)
- 컴파일 알고리즘 변경 및 버그 픽스
- 웹 UI 마이너 변경
- 퍼블리싱용 README 파일 추가

###V 1.2.3
- 컴파일 관련 파일 삭제 시스템 수정
- 스코어링 알고리즘 변경 및 버그 픽스
- 대회 문제 수정 관련 버스 픽스
- 기타 웹단 마이너 버그 픽스

###V 1.2.2
- Dockerfile 관련 버그 픽스

###V 1.2.1
- Nginx 설정 및 최초 배포버전
- 마이너 버그 픽스

###V 1.1.1
- Docker compose 최초 설정
