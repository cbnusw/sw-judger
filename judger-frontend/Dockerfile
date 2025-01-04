FROM node:18-alpine AS build

RUN mkdir -p /app

RUN mkdir -p /etc/nginx/ssl

WORKDIR /app

COPY package*.json yarn.lock ./
COPY ./ckeditor5 ./ckeditor5

RUN yarn install

COPY . .
RUN yarn build

CMD ["yarn", "start"]