class CrawlSourceJob < ApplicationJob
  queue_as :default

  def perform(url)
    PubSub.queued_publish("source:crawl", url)
  end
end
