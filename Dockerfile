FROM node:17 AS metadata
LABEL maintainer="Stefano Pigozzi <me@steffo.eu>"
WORKDIR /usr/src/app

FROM metadata AS dependencies
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn install

FROM dependencies AS package
COPY . .

FROM package AS environment

FROM environment AS entrypoint
ENTRYPOINT ["yarn", "run", "start"]
