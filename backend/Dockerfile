FROM node:20.11.0
WORKDIR /usr/src/app

EXPOSE 80

ENV PORT_OPEN=80
ENV HOST_OPEN=0.0.0.0

COPY package*.json ./

RUN npm ci --only-production

COPY . .

ENTRYPOINT [ "node", "index.js" ]