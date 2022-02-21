class CommentSerializer
  include JSONAPI::Serializer

  set_key_transform :camel_lower

  attributes(*%i[
    author_id
    author_username
    body
    comments_count
    created_at
    downvote_count
    edited_at
    karma
    laplace_rank
    parent_id
    section
    source_id
    updated_at
    upvote_count
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

  # has_many :comment_votes do |comment, params|
  #   current_user = params[:current_user]
  #   return [] if current_user.blank?

  #   CommentVote.where(comment: comments, user: current_user)
  # end
end
