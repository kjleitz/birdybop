class CommentPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    logged_in? && user.id == record.author_id
  end

  def update?
    logged_in? && (user.admin? || user.id == record.author_id)
  end

  def destroy?
    logged_in? && user.admin?
  end
end
