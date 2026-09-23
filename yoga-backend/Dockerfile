FROM node:20-alpine AS builder

WORKDIR /app

ENV TZ=Asia/Kolkata
RUN apk add --no-cache tzdata

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "start"]
