class Source < ApplicationRecord
  belongs_to :submitter, class_name: "User", optional: true, inverse_of: :sources

  has_many :comments, dependent: :destroy
  has_many :source_votes, dependent: :destroy
  has_many :source_pages, dependent: :destroy

  validates :path, presence: true, uniqueness: { case_sensitive: false }
  validates :name, presence: true, uniqueness: { case_sensitive: false }

  def crawl!
    CrawlSourceJob.perform_later(path)
  end

  def crawled?
    last_crawled_at.present?
  end

  def should_crawl?
    !crawled? || last_crawled_at < 1.week.ago
  end
end
