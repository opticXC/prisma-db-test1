FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY prisma/schema.prisma ./prisma/schema.prisma
COPY . .

CMD ["npm", "start"]
