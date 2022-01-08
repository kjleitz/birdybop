class SourceSerializer
  include JSONAPI::Serializer

  set_key_transform :camel_lower

  attributes(*%i[
    submitter_id
    name
    description
    path
    karma
    created_at
    updated_at
  ])
end
