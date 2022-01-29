# TODO: This, from the Sidekiq docs:
#
#   Many people use Redis as a cache (it works great as a Rails cache store) but
#   it's important that Sidekiq be run against a Redis instance that is not
#   configured as a cache but as a persistent store. I recommend using two
#   separate Redis instances, each configured appropriately, if you wish to use
#   Redis for caching and Sidekiq. Redis namespaces do not allow for this
#   configuration and come with many other problems, so using discrete Redis
#   instances is always preferred.
#
# https://github.com/mperham/sidekiq/wiki/Using-Redis#multiple-redis-instances

Sidekiq.configure_server do |config|
  config.redis = {
    host: ENV["REDIS_HOST"],
    port: ENV.fetch("REDIS_PORT") { "6379" },
    network_timeout: 5,
  }
end

Sidekiq.configure_client do |config|
  config.redis = {
    host: ENV["REDIS_HOST"],
    port: ENV.fetch("REDIS_PORT") { "6379" },
    network_timeout: 5,
  }
end
