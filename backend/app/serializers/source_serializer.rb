class SourceSerializer
  include JSONAPI::Serializer

  set_key_transform :camel_lower

  attributes(*%i[
    comments_count
    created_at
    description
    karma
    name
    path
    submitter_id
    updated_at
  ])

  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # TODO: remove/nerf
  # has_many :comments
end
