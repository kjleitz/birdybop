class ApplicationController < ActionController::API
  include Pundit

  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  rescue_from Pundit::NotAuthorizedError, with: :pundit_not_authorized

  # Sets a new refresh token for the user on the session, then returns a new
  # access token. This is what you should use to generate new access tokens.
  def log_in_user(user)
    session[:refresh_token] = refresh_token_for(user)
    @current_user = user
    access_token_for(user)
  end

  def current_user
    return @current_user if defined?(@current_user)

    user_id = JwtToken.decode(access_token)[:user_id]
    @current_user = User.find_by(id: user_id)
  end

  def clear_current_user
    session.delete(:refresh_token)
    @current_user = nil
  end

  def logged_in?
    !!current_user
  end

  def access_token
    header = request.headers["Authorization"] || ""
    header.split(" ").second || ""
  end

  def refresh_token
    session[:refresh_token] || ""
  end

  def render_errors(errors, status = :unprocessable_entity)
    error_messages = case errors
    when Array then errors
    when nil then ["Something went wrong"]
    when ActiveRecord::Base then errors.errors.full_messages
    when ActiveModel::Errors then errors.full_messages
    else [errors]
    end

    render json: { errors: error_messages }, status: status
  end

  def render_unauthorized(error = "Invalid credentials")
    render_errors(error, :unauthorized)
  end

  def render_forbidden(error = "Insufficient permissions to perform this action")
    render_errors(error, :forbidden)
  end

  protected

  def require_authentication
    render_unauthorized("Authentication required to perform this action") unless logged_in?
  end

  private

  def access_token_for(user)
    JwtToken.encode({ user_id: user.id }, expires_at: 30.minutes.from_now)
  end

  def refresh_token_for(user)
    JwtToken.encode({ user_id: user.id }, expires_at: 1.year.from_now)
  end

  def pundit_not_authorized(_exception)
    render_forbidden
  end
end
