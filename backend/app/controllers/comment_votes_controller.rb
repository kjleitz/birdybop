class CommentVotesController < ApplicationController
  before_action :require_authentication

  # POST /comments/1/comment_votes
  def create
    comment = Comment.find(params[:comment_id])
    comment_vote = comment.comment_votes.where(user: current_user).first_or_initialize
    authorize(comment_vote)

    render_no_double_voting and return if would_duplicate?(comment_vote, comment_vote_params)

    comment_vote.assign_attributes(comment_vote_params)

    if comment_vote.save
      render status: :created, json: CommentVoteSerializer.new(comment_vote).as_json
    else
      render_errors comment_vote
    end
  end

  # DELETE /comments/1/comment_votes
  def destroy
    comment_vote = current_user.comment_votes.find_by!(comment_id: params[:comment_id])
    authorize(comment_vote)

    if comment_vote.destroy
      render status: :no_content
    else
      render_errors comment_vote
    end
  end

  private

  # It wouldn't _really_ duplicate it, because there's a unique constraint on
  # a multicolumn index of `user_id` and `comment_id` on the `comment_votes`
  # table, but I want to be able to return a semantically-appropriate HTTP error
  # (403: Forbidden) rather than a validation error (422: Unprocessable Entity)
  # or a successful creation (201: Created).
  def would_duplicate?(comment_vote, attrs)
    comment_vote.persisted? && attrs[:upvote] == comment_vote.upvote?
  end

  def comment_vote_params
    params.require(:comment_vote).permit(:upvote)
  end

  def render_no_double_voting
    render_forbidden("Double voting is forbidden")
  end
end
