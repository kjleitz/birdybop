class SourceVoteSerializer
  include JSONAPI::Serializer

  set_key_transform :camel_lower

  attributes(*%i[
    user_id
    source_id
    upvote
    created_at
    updated_at
  ])
end
