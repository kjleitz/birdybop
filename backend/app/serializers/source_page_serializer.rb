class SourcePageSerializer
  include JSONAPI::Serializer

  set_key_transform :camel_lower

  attributes(*%i[
    source_id
    url
    created_at
    updated_at
  ])
end
