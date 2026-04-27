FROM node:18-alpine

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev

WORKDIR /opt/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "develop"]