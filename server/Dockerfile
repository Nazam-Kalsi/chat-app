FROM node:20-alpine3.20 AS base

RUN mkdir -p /server/dev

WORKDIR /server/dev

RUN npm install yarn

COPY package.json .

RUN yarn install


FROM base AS dev
COPY . .

CMD ["yarn", "dev"]