class UsersController < ApplicationController
  # GET /users
  def index
    users = User.all
    render json: users
  end

  # GET /users/1
  def show
    user = User.find(params[:id])
    render json: user
  end

  # POST /users
  def create
    user = User.new(user_params_with_password)

    if user.save
      render json: user, status: :created, location: user
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    user = User.find(params[:id])

    render status: :unauthorized and return if changing_password? && !user.authenticate(old_password)

    if user.update(changing_password? ? user_params_with_password : user_params)
      render json: user
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    user = User.find(params[:id])

    if user.destroy
      render status: :no_content
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(
      :username,
      :about,
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
