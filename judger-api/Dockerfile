FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g pm2

COPY . .

EXPOSE 4003:4003

CMD ["pm2-docker", "index.js" , "-i", "6", "--name", "api-server"]
