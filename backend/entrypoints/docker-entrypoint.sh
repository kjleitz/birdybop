#!/bin/sh

# Adapted from this DigitalOcean tutorial:
# https://www.digitalocean.com/community/tutorials/containerizing-a-ruby-on-rails-application-for-development-with-docker-compose

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

bundle check || bundle install

# From the DigitalOcean tutorial linked above:
#
#   We use the -b option with this command to bind the server to all IP
#   addresses rather than to the default, `localhost`. This invocation makes the
#   Rails server route incoming requests to the container IP rather than to the
#   default `localhost`.
#
bundle exec rails s -b 0.0.0.0
