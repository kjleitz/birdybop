require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user1 = users(:user1)
  end

  test "should get index" do
    get users_url, as: :json
    assert_response :success
  end

  test "should create user" do
    user_attrs = attributes_for(:user)

    assert_difference('User.count') do
      post(
        users_url,
        as: :json,
        params: {
          user: {
            username: user_attrs[:username],
            about: user_attrs[:about],
            password: user_attrs[:password],
          },
        },
      )
    end

    assert_response 201

    user = User.last
    assert_equal(user.username, user_attrs[:username])
    assert(user.authenticate(user_attrs[:password]))
  end

  test "should show user" do
    get user_url(@user1), as: :json
    assert_response :success
  end

  test "should update user without a password change" do
    patch(
      user_url(@user1),
      as: :json,
      params: {
        user: {
          username: @user1.username,
          about: @user1.about,
        },
      },
    )

    assert_response 200
  end

  test "should NOT update user if the new username is non-unique" do
    user2 = users(:user2)

    patch(
      user_url(@user1),
      as: :json,
      params: {
        user: {
          username: user2.username,
          about: @user1.about,
        },
      },
    )

    assert_response 422

    response_json = JSON.parse(response.body)
    assert_predicate(response_json["errors"], :present?)
    assert_predicate(response_json["errors"]["username"], :present?)
  end

  test "should update user with a password change if the old password was supplied correctly" do
    assert(@user1.authenticate("password123"))
    refute(@user1.authenticate("foobar"))

    old_username = @user1.username
    old_about = @user1.about
    new_username = "#{old_username}_blah"
    new_about = "#{old_about} blah"

    patch(
      user_url(@user1),
      as: :json,
      params: {
        user: {
          username: new_username,
          about: new_about,
          password: "foobar",
          old_password: "password123",
        },
      },
    )

    assert_response 200
    @user1.reload

    refute(@user1.authenticate("password123"))
    assert(@user1.authenticate("foobar"))
    assert_equal(@user1.username, new_username)
    assert_equal(@user1.about, new_about)
  end

  test "should NOT update user with a password change if the old password was supplied incorrectly" do
    assert(@user1.authenticate("password123"))
    refute(@user1.authenticate("foobar"))

    old_username = @user1.username
    old_about = @user1.about
    new_username = "#{old_username}_blah"
    new_about = "#{old_about} blah"

    patch(
      user_url(@user1),
      as: :json,
      params: {
        user: {
          username: new_username,
          about: new_about,
          password: "foobar",
          old_password: "abc123",
        },
      },
    )

    assert_response 401
    @user1.reload

    assert(@user1.authenticate("password123"))
    refute(@user1.authenticate("foobar"))
    refute_equal(@user1.username, new_username)
    refute_equal(@user1.about, new_about)
  end

  test "should destroy user" do
    assert_difference('User.count', -1) do
      delete user_url(@user1), as: :json
    end

    assert_response 204
  end
end
