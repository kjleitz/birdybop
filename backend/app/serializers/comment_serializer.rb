class CommentSerializer
  include JSONAPI::Serializer

  set_key_transform :camel_lower

  attributes(*%i[
    author_id
    parent_id
    source_id
    body
    section
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
  # has_many :children, serializer: CommentSerializer
end
