class AddLastCrawledAtToSources < ActiveRecord::Migration[7.0]
  def change
    add_column :sources, :last_crawled_at, :timestamp, null: true
  end
end
