#
# NOTE: This model class is a PORO, not an ActiveRecord model class.
#
class SearxResult
  SEARX_RESULT_PROPERTIES = %i[
    category
    content
    engine
    engines
    is_onion
    parsed_url
    positions
    pretty_url
    score
    title
    url
  ].freeze

  attr_accessor(*SEARX_RESULT_PROPERTIES)

  attr_accessor(*%i[
    source_ids
  ])

  def initialize(raw_attrs = {})
    attrs = raw_attrs.symbolize_keys
    whitelisted_attrs = attrs.slice(*SEARX_RESULT_PROPERTIES)
    whitelisted_attrs.each { |key, value| send("#{key}=", value) }
    self.source_ids = attrs[:source_ids] || []
  end

  def id
    @id ||= Digest::MD5.hexdigest(url)
  end

  def sanitized_path
    Source.sanitize_path(url)
  end

  def path_segments
    Source.path_segments(sanitized_path)
  end

  def path_family
    Source.path_family(sanitized_path)
  end

  # def sources
  #   @sources ||= Source.source_family(sanitized_path)
  # end

  # def source_ids
  #   sources.ids
  # end
end
