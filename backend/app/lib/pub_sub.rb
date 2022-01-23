class PubSub
  class << self
    def queued_publish(key, value)
      queue_channel = redis_queue_key(key)
      action_channel = redis_action_key(key)
      Redis.current.rpush(queue_channel, value)
      Redis.current.publish(action_channel, queue_channel)
    end

    def redis_queue_key(key)
      "birdybop:#{Rails.env}:queue:#{key}"
    end

    def redis_action_key(key)
      "birdybop:#{Rails.env}:action:#{key}"
    end
  end
end
