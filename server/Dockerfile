FROM node:23-alpine3.20 AS base
RUN mkdir -p /server/dev

WORKDIR /server/dev

COPY package.* .

RUN yarn


From base As dev
copy . .

CMD ['yarn', 'dev']