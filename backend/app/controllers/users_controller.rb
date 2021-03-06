class UsersController < ApplicationController
  before_action :require_authentication, except: [:index, :show, :create]

  # GET /users
  def index
    users = policy_scope(User.all)
    render json: UserSerializer.new(users, is_collection: true).as_json
  end

  # GET /users/1
  def show
    user = User.find(params[:id])
    authorize(user)
    render json: UserSerializer.new(user).as_json
  end

  # POST /users
  def create
    user = User.new(user_params_with_password)
    authorize(user)

    if user.save
      new_access_token = log_in_user(user)
      user_data = UserSerializer.new(user, meta: { accessToken: new_access_token }).as_json
      render json: user_data, status: :created, location: user
    else
      render_errors user
    end
  end

  # PATCH/PUT /users/1
  def update
    user = User.find(params[:id])
    authorize(user)
    render_unauthorized and return if changing_password? && !user.authenticate(old_password)

    if user.update(changing_password? ? user_params_with_password : user_params)
      render json: UserSerializer.new(user).as_json
    else
      render_errors user
    end
  end

  # DELETE /users/1
  def destroy
    user = User.find(params[:id])
    authorize(user)

    if user.destroy
      render status: :no_content
    else
      render_errors user
    end
  end

  private

  def user_params
    params.require(:user).permit(
      :username,
      :bio,
    )
  end

  def password_params
    params.require(:user).permit(:password)
  end

  def user_params_with_password
    user_params.merge(password_params)
  end

  def old_password
    params.dig(:user, :old_password)
  end

  def new_password
    params.dig(:user, :password)
  end

  def changing_password?
    old_password.present? && new_password.present? && old_password != new_password
  end
end
