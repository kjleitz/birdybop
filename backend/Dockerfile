# Adapted from this DigitalOcean tutorial:
# https://www.digitalocean.com/community/tutorials/containerizing-a-ruby-on-rails-application-for-development-with-docker-compose

FROM ruby:2.7.3-alpine

ENV LANG C.UTF-8
ENV BUNDLER_VERSION=2.2.26

# NodeJS & Yarn removed from this list because we're using Rails' API-only mode.
# Removed Python because `apk` complained that there is "no such package," and
# because, well, do we really need Python?
RUN apk add --update --no-cache \
  bash \
  binutils-gold \
  build-base \
  curl \
  file \
  g++ \
  gcc \
  git \
  less \
  libc-dev \
  libffi-dev \
  libgcrypt-dev \
  libstdc++ \
  libxml2-dev \
  libxslt-dev \
  linux-headers \
  make \
  netcat-openbsd \
  openssl \
  pkgconfig \
  postgresql-dev \
  tzdata

RUN gem install bundler -v ${BUNDLER_VERSION}

WORKDIR /app

COPY Gemfile Gemfile.lock ./

# Don't know why we need Nokogiri since we're in API-only mode, but I see it in
# the Gemfile.lock, so :man_shrugging: The `--use-system-libraries` option
# instructs it to use the `libxml2-dev` and `libxslt-dev` packages we just
# installed earlier.
RUN bundle config build.nokogiri --use-system-libraries

RUN bundle check || bundle install

## API-only mode; no need.
# COPY package.json yarn.lock ./
# RUN yarn install --check-files

COPY . .

ENTRYPOINT ["./entrypoints/docker-entrypoint.sh"]
