FROM oven/bun:latest

WORKDIR /app

COPY package*.json ./
RUN bun install
RUN bun prisma generate
COPY . .


CMD [ "bun", "sources/index.ts" ]
