FROM oven/bun:latest


COPY package.json ./
COPY bun.lockb ./
COPY sources ./
COPY prisma ./prisma/

RUN bun install
RUN bun x prisma generate --schema ./prisma/schema.prisma
COPY . .


EXPOSE 8080

CMD [ "bun", "run", "sources/index.ts" ]
