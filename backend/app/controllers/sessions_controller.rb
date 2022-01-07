class SessionsController < ApplicationController
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def create
    user = User.find_by(username: session_params[:username])
    render_incorrect_creds and return if user.blank?
    render_incorrect_creds and return unless user.authenticate(session_params[:password])

    new_access_token = log_in_user(user)
    render json: { access_token: new_access_token }, status: :created
  end

  def refresh
    render_no_refresh and return if refresh_token.blank?

    user_id = JwtToken.decode(refresh_token)[:user_id]
    user = User.find_by(id: user_id)
    render_no_refresh and return if user.blank?

    new_access_token = log_in_user(user)
    render json: { access_token: new_access_token }
  end

  def destroy
    clear_current_user
    render status: :no_content
  end

  private

  def session_params
    params.require(:user).permit(:username, :password)
  end

  def render_incorrect_creds
    render_unauthorized "Incorrect username and/or password"
  end

  def render_no_refresh
    render_unauthorized "Refresh token is invalid or missing"
  end
end
