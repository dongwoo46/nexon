FROM node:18-alpine AS builder
WORKDIR /app

# 패키지 복사
COPY package*.json ./
RUN npm install
COPY . .

# 전체 프로젝트 빌드
RUN npm run build:all



FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --only=production

