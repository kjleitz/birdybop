class UserPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    true
  end

  def update?
    logged_in? && (user.admin? || user.id == record.id)
  end

  def destroy?
    logged_in? && (user.admin? || user.id == record.id)
  end
end
