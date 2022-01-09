FROM node:16.13.0 AS build

RUN mkdir -p /app

RUN mkdir -p /etc/nginx/ssl

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN npm run build

FROM nginx

COPY --from=build app/dist/main /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

#COPY nginx/ssl/* /etc/nginx/ssl/
#
#COPY nginx/ssl/swjudge.cbnu.ac.kr/* /etc/nginx/ssl/swjudge.cbnu.ac.kr/
#
#COPY nginx/ssl/swjudgeapi.cbnu.ac.kr/* /etc/nginx/ssl/swjudgeapi.cbnu.ac.kr/

EXPOSE 80
EXPOSE 443
