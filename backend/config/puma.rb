# Puma can serve each request in a thread from an internal thread pool.
# The `threads` method setting takes two numbers: a minimum and maximum.
# Any libraries that use thread pools should be configured to match
# the maximum value specified for Puma. Default is set to 5 threads for minimum
# and maximum; this matches the default thread size of Active Record.
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads(min_threads_count, max_threads_count)

env = ENV.fetch("RAILS_ENV") { ENV.fetch("RACK_ENV") { "development" } }

# Specifies the `worker_timeout` threshold that Puma will use to wait before
# terminating a worker in development environments.
worker_timeout(3600) if env == "development"

# I don't know what this does.
rackup(DefaultRackup) if env == "production"

# Specifies the `port` that Puma will listen on to receive requests; default is 3000.
port(ENV.fetch("PORT") { 3000 })

# Specifies the `environment` that Puma will run in.
environment(env)

# Specifies the `pidfile` that Puma will use.
pidfile(ENV.fetch("PIDFILE") { "tmp/pids/server.pid" })

# Specifies the number of `workers` to boot in clustered mode.
# Workers are forked web server processes. If using threads and workers together
# the concurrency of the application would be max `threads` * `workers`.
# Workers do not work on JRuby or Windows (both of which do not support
# processes).
workers(Integer(ENV.fetch("WEB_CONCURRENCY") { 2 })) if env == "production"

# Use the `preload_app!` method when specifying a `workers` number.
# This directive tells Puma to first boot the application and load code
# before forking the application. This takes advantage of Copy On Write
# process behavior so workers use less memory.
preload_app! if env == "production"

# Allow puma to be restarted by `rails restart` command.
plugin(:tmp_restart)

on_worker_boot do
  # Worker specific setup for Rails 4.1+
  # See: https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server#on-worker-boot
  ActiveRecord::Base.establish_connection
end
