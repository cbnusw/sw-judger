FROM node:18-alpine AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일만 복사 (자주 변경되지 않음)
COPY package*.json yarn.lock ./
COPY ./ckeditor5 ./ckeditor5

# 4. 의존성 설치 (이 단계는 캐시 활용 가능)
RUN yarn install --production

# 5. 소스 코드 복사 (자주 변경됨)
COPY . .

# 6. 빌드 작업 실행
RUN yarn build

# 7. 컨테이너 실행 명령
CMD ["yarn", "start"]
