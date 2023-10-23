FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.json ./
COPY prisma ./
COPY index.ts ./
COPY sources ./

RUN bun install
RUN bunx prisma generate

COPY . .
EXPOSE 8000 8080 3000 5432 


ENTRYPOINT [ "bun", "index.ts" ]


