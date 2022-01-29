FROM node:14-alpine

RUN apk add --update --no-cache \
  curl \
  && curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

CMD ["pnpm", "run", "serve", "--aggregate-output"]
