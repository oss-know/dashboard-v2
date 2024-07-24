FROM node:lts-alpine

COPY ./config /app/config
COPY ./public /app/public
COPY ./src /app/src
COPY ./jest.config.ts /app/jest.config.ts
COPY ./jsconfig.json /app/jsconfig.json
COPY ./package.json /app/package.json
COPY ./tsconfig.json /app/tsconfig.json
# COPY ./yarn.lock /app/yarn.lock
# COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml


WORKDIR /app
RUN yarn --ignore-engines
#RUN NODE_OPTIONS=--openssl-legacy-provider npm run build
RUN NODE_ENV=production npm run build



FROM nginx:stable
COPY --from=0 /app/dist/ /dist
COPY dashboard-v2.nginx.conf /etc/nginx/conf.d/default.conf

