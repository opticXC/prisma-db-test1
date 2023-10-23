FROM oven/bun:latest
WORKDIR /app

COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.json ./
COPY prisma ./
COPY index.ts ./
COPY sources ./


RUN bun install
RUN bun prisma generate

COPY . .
EXPOSE 8000
EXPOSE 5435


ENTRYPOINT [ "bun", "index.ts" ]


