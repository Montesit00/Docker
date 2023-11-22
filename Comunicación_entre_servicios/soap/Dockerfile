FROM node:18-alpine

WORKDIR /index

COPY package*.json ./

RUN apk --no-cache add netcat-openbsd

RUN npm install

COPY . .