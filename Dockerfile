FROM oven/bun:latest

WORKDIR /app

COPY package*.json ./package.json
COPY bun.lockb ./bun.lockb
COPY sources ./sources
COPY prisma ./prisma

RUN bun install
RUN bun x prisma generate
COPY . .

EXPOSE 8080

CMD [ "bun", "run", "sources/index.ts" ]
