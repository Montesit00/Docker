FROM node:18-alpine

WORKDIR /app

RUN apk --no-cache add netcat-openbsd

COPY package*.json ./

RUN npm install

COPY . .