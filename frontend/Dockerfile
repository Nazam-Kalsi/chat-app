FROM node:20-alpine AS base

RUN mkdir -p /frontend/dev

WORKDIR /frontend/dev

RUN npm install yarn

COPY package.* *.lock .

RUN yarn install

FROM base AS dev
COPY . .

CMD ["yarn", "dev"]
