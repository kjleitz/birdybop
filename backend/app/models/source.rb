class Source < ApplicationRecord
  belongs_to :submitter, class_name: "User", optional: true, inverse_of: :sources

  has_many :comments, dependent: :destroy
  has_many :source_votes, dependent: :destroy
  has_many :source_pages, dependent: :destroy

  validates :path, presence: true, uniqueness: { case_sensitive: false }
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validate :path_must_be_sanitized!
  validate :domain_must_be_valid!

  class << self
    def sanitize_path(path)
      path
        .to_s # could be `nil` or some other non-String, if I'm being paranoid
        .strip # could have leading or trailing whitespace
        .split("\n") # could be multi-line...
        .first # ...so, just take the first line
        .downcase # all lower-case... might be case-sensitive IRL but shouldn't be for matching
        .gsub(/[?#].*\z/, "") # remove query params and hash from the URL
        .gsub(/\/+\z/, "") # remove trailing slash(es) (shouldn't be multiple, but... paranoia)
        .gsub(/\A.*:\/\//, "") # remove protocol (even repeated protocol strings)
        .gsub(/\A((www|m)\.)+/, "") # remove "www" and "m" subdomains (others should be kept)
    end

    # e.g., "foo.com/bar/baz" => "foo.com"
    def domain(path)
      path_segments(path).first
    end

    # e.g., "foo.com/bar/baz" => ["foo.com", "foo.com/bar"]
    def parent_paths(path)
      family = path_family(path)
      family.first(family.count - 1)
    end

    # See the comment above the instance method by the same name
    def parent_sources(path)
      where(path: parent_paths(path))
    end

    # e.g., "foo.com/bar/baz" => ["foo.com", "foo.com/bar", "foo.com/bar/baz"]
    def path_family(path)
      segments = path_segments(path)
      segments.map.with_index do |segment, index|
        segments.first(index).append(segment).join("/")
      end
    end

    # e.g., "foo.com/bar/baz" => ["foo.com", "bar", "baz"]
    def path_segments(path)
      path.split("/")
    end

    # Like `parent_sources` except it also includes the child source
    def source_family(path)
      where(path: path_family(path))
    end

    # e.g., "foo.com/bar/baz" => "/bar/baz"
    def sub_path(path)
      path.delete_prefix(domain(path))
    end

    def uri(path)
      URI::HTTPS.build(host: domain(path), path: sub_path(path))
    end

    def fetch_page_info_for_path(path, bust_cache: false)
      key = "source:#{Utils.encode_base64(path)}:page_info"
      Rails.cache.delete(key) if bust_cache
      Rails.cache.fetch(key, expires_in: 10.minutes) do
        # TODO: Is this inefficient? Should I be using a single instance
        #       globally or something?
        faraday = Faraday.new { |f| f.use BirdybopFaradayMiddleware::FollowRedirects }
        response = faraday.get(Source.uri(path))
        document = Nokogiri::HTML(response.body)
        description = document.css('meta[name="description"]').first&.text || ""

        {
          title: document.title,
          description: description,
        }
      rescue Faraday::ConnectionFailed => e
        {
          title: path.gsub("/", "-").titleize,
          description: "",
        }
      end
    end
  end

  def path=(new_path)
    super(Source.sanitize_path(new_path))
  end

  def crawl!
    CrawlSourceJob.perform_later(path)
  end

  def crawled?
    last_crawled_at.present?
  end

  # e.g., "foo.com/bar/baz" => "foo.com"
  def domain
    Source.domain(path)
  end

  def domain_valid?
    domain.include?(".")
  end

  # e.g., "foo.com/bar/baz" => ["foo.com", "foo.com/bar"]
  def parent_paths
    Source.parent_paths(path)
  end

  # Basically any/all Source records with paths that are subsets of this one.
  # For example, imagine that these comprise all the sources in the database:
  #
  #   id: 1, path: "beep.net/boop"
  #   id: 2, path: "example.org"
  #   id: 3, path: "example.org/whoa"
  #   id: 4, path: "foo.com"
  #   id: 5, path: "foo.com/bar"
  #   id: 6, path: "foo.com/bar/baz/bam"
  #
  # Now, see the results of the following:
  #
  #   # beep.net/boop
  #   Source.find(1).parent_sources.pluck(:path)
  #   => [] # no parents in the DB (even though it's a subpath of beep.net)
  #
  #   # example.org
  #   Source.find(2).parent_sources.pluck(:path)
  #   => [] # no parents in the DB (makes sense; it's just a bare domain)
  #
  #   # example.org/whoa
  #   Source.find(3).parent_sources.pluck(:path)
  #   => ["example.org"]
  #
  #   # foo.com
  #   Source.find(4).parent_sources.pluck(:path)
  #   => [] # no parents in the DB (makes sense; it's just a bare domain)
  #
  #   # foo.com/bar
  #   Source.find(5).parent_sources.pluck(:path)
  #   => ["foo.com"]
  #
  #   # foo.com/bar/123/bam
  #   Source.find(6).parent_sources.pluck(:path)
  #   => ["foo.com", "foo.com/bar"] # notice foo.com/bar/123 isn't in the DB
  #
  def parent_sources
    Source.parent_sources(path)
  end

  # e.g., "foo.com/bar/baz" => ["foo.com", "foo.com/bar", "foo.com/bar/baz"]
  def path_family
    Source.path_family(path)
  end

  def path_sanitized?
    path == Source.sanitize_path(path)
  end

  # e.g., "foo.com/bar/baz" => ["foo.com", "bar", "baz"]
  def path_segments
    Source.path_segments(path)
  end

  def should_crawl?
    !crawled? || last_crawled_at < 1.week.ago
  end

  # e.g., "foo.com/bar/baz" => "/bar/baz"
  def sub_path
    Source.sub_path(path)
  end

  def uri
    Source.uri(path)
  end

  # def upvote!(voter)

  # end

  private

  def domain_must_be_valid!
    errors.add(:domain, "must be valid") unless domain.include?(".")
  end

  def path_must_be_sanitized!
    errors.add(:path, "must be sanitized") unless path_sanitized?
  end
end
