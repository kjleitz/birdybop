class SourceVotesController < ApplicationController
  before_action :require_authentication

  # POST /sources/1/source_votes
  def create
    source = Source.find(params[:source_id])
    source_vote = source.source_votes.where(user: current_user).first_or_initialize
    authorize(source_vote)

    render_no_double_voting and return if would_duplicate?(source_vote, source_vote_params)

    source_vote.assign_attributes(source_vote_params)

    if source_vote.save
      render status: :created, json: SourceVoteSerializer.new(source_vote).as_json
    else
      render_errors source_vote
    end
  end

  # DELETE /sources/1/source_votes
  def destroy
    source_vote = current_user.source_votes.find_by!(source_id: params[:source_id])
    authorize(source_vote)

    if source_vote.destroy
      render status: :no_content
    else
      render_errors source_vote
    end
  end

  private

  # It wouldn't _really_ duplicate it, because there's a unique constraint on
  # a multicolumn index of `user_id` and `source_id` on the `source_votes`
  # table, but I want to be able to return a semantically-appropriate HTTP error
  # (403: Forbidden) rather than a validation error (422: Unprocessable Entity)
  # or a successful creation (201: Created).
  def would_duplicate?(source_vote, attrs)
    source_vote.persisted? && attrs[:upvote] == source_vote.upvote?
  end

  def source_vote_params
    params.require(:source_vote).permit(:upvote)
  end

  def render_no_double_voting
    render_forbidden("Double voting is forbidden")
  end
end
