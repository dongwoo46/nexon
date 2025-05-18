FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY nest-cli.json .
COPY tsconfig*.json ./
COPY apps ./apps
COPY libs ./libs
COPY .env .

# 전체 프로젝트 빌드
RUN npm run build:all



FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env .env

RUN npm install --only=production