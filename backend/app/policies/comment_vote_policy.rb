class CommentVotePolicy < ApplicationPolicy
  def create?
    logged_in? && user.id == record.user_id
  end

  def destroy?
    logged_in? && user.id == record.user_id
  end
end
