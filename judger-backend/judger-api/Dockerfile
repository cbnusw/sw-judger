FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g pm2

COPY . .

EXPOSE 4003

CMD ["npm", "run", "start"]
