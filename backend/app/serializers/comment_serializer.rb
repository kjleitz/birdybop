class CommentSerializer
  include JSONAPI::Serializer

  set_key_transform :camel_lower

  attributes(*%i[
    author_id
    author_username
    body
    comments_count
    created_at
    karma
    parent_id
    section
    source_id
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
  # # has_many :children, serializer: CommentSerializer
  # has_many :children
end
