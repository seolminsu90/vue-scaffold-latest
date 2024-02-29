FROM node:18-alpine3.17 as builder

WORKDIR /frontend
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
