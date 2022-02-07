class SearxResultSerializer
  include JSONAPI::Serializer

  set_key_transform :camel_lower

  attributes(*SearxResult::SEARX_RESULT_PROPERTIES.dup.append(
    :sanitized_path,
    :path_segments,
    :path_family,
  ))

  has_many :sources
end
