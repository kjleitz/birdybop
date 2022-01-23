class SourceSerializer
  include JSONAPI::Serializer

  set_key_transform :camel_lower

  attributes(*%i[
    submitter_id
    name
    description
    path
    karma
    comments_count
    created_at
    updated_at
  ])

  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # # TODO: remove/nerf
  # has_many :comments
end
