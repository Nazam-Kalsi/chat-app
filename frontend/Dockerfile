FROM node:20-alpine AS base

RUN mkdir -p /frontend/dev

WORKDIR /server/dev

COPY package.* .

RUN yarn install

RUN yarn


FROM base As dev
COPY . .

CMD ["yarn", "dev"]
