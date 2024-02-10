FROM node:20.11.0 AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --silent --only=production

ARG REACT_APP_API

ENV REACT_APP_API=$REACT_APP_API

COPY . ./

RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build /app

ENV NGINX_ENVSUBST_OUTPUT_DIR /app/static/js

WORKDIR /app/static/js
RUN mkdir /etc/nginx/templates; \
    for file in *.js; \
    do \
        mv -- "$file" "/etc/nginx/templates/$file.template"; \
    done