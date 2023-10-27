# Development stage
FROM node:18 as development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY prisma ./
RUN npx prisma generate
COPY ./src ./
CMD [ "npm", "run", "start" ]

# Builder stage
FROM development as builder
WORKDIR /usr/src/app
# Build the app with devDependencies still installed from "development" stage
RUN npm run setup


# Production stage
FROM alpine:latest as production
RUN apk --no-cache add nodejs ca-certificates
WORKDIR /root/
COPY --from=builder /usr/src/app ./
CMD [ "npm", "run", "start" ]
