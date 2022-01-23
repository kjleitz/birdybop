require "test_helper"

# This is embarrassingly hard to read. Split the iterated tests out over
# explicit ones, or move back to RSpec for better nesting/organization. Minitest
# seems nice and simple, but it really lacks some of the more useful bits of
# RSpec's DSL.

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user1 = users(:user1)
  end

  [
    ["logged out", nil],
    ["logged in as a peasant", :user],
    ["logged in as a mod", :mod_user],
    ["logged in as an admin", :admin_user],
  ].each do |state_description, user_factory_name|
    test "should get index (when #{state_description})" do
      log_in_as_user_factory(user_factory_name)
      get users_url, as: :json, headers: @auth_headers
      assert_response :success
    end

    if user_factory_name.nil?
      test "should NOT create user (when #{state_description})" do
        log_in_as_user_factory(user_factory_name)
        user_attrs = attributes_for(:user)

        assert_difference('User.count', 0) do
          post(
            users_url,
            as: :json,
            headers: @auth_headers,
            params: {
              user: {
                username: user_attrs[:username],
                bio: user_attrs[:bio],
                password: user_attrs[:password],
              },
            },
          )

          assert_response 401
        end
      end
    else
      test "should create user (when #{state_description})" do
        log_in_as_user_factory(user_factory_name)
        user_attrs = attributes_for(:user)

        assert_difference('User.count', 1) do
          post(
            users_url,
            as: :json,
            headers: @auth_headers,
            params: {
              user: {
                username: user_attrs[:username],
                bio: user_attrs[:bio],
                password: user_attrs[:password],
              },
            },
          )

          assert_response 201
        end

        user = User.last
        assert_equal(user.username, user_attrs[:username])
        assert(user.authenticate(user_attrs[:password]))
      end
    end

    test "should show user (when #{state_description})" do
      log_in_as_user_factory(user_factory_name)
      get user_url(@user1), as: :json, headers: @auth_headers
      assert_response :success
    end

    if user_factory_name == :admin_user
      test "should update user without a password change (when #{state_description})" do
        log_in_as_user_factory(user_factory_name)

        old_username = @user1.username
        old_bio = @user1.bio
        new_username = "#{old_username}_blah"
        new_bio = "#{old_bio} blah"

        patch(
          user_url(@user1),
          as: :json,
          headers: @auth_headers,
          params: {
            user: {
              username: new_username,
              bio: new_bio,
            },
          },
        )

        assert_response 200
        @user1.reload

        assert_equal(@user1.username, new_username)
        assert_equal(@user1.bio, new_bio)
      end

      test "should destroy user (when #{state_description})" do
        log_in_as_user_factory(user_factory_name)

        assert_difference('User.count', -1) do
          delete user_url(@user1), as: :json, headers: @auth_headers
        end

        assert_response 204
      end
    elsif user_factory_name == :user
      test "should update user without a password change (when #{state_description}) (as the same user)" do
        current_user = log_in_as_user_factory(user_factory_name)

        old_username = current_user.username
        old_bio = current_user.bio
        new_username = "#{old_username}_blah"
        new_bio = "#{old_bio} blah"

        patch(
          user_url(current_user),
          as: :json,
          headers: @auth_headers,
          params: {
            user: {
              username: new_username,
              bio: new_bio,
            },
          },
        )

        assert_response 200
        current_user.reload

        assert_equal(current_user.username, new_username)
        assert_equal(current_user.bio, new_bio)
      end

      test "should destroy user (when #{state_description}) (as the same user)" do
        current_user = log_in_as_user_factory(user_factory_name)

        assert_difference('User.count', -1) do
          delete user_url(current_user), as: :json, headers: @auth_headers
        end

        assert_response 204
      end

      test "should NOT update user without a password change (when #{state_description}) (as NOT the same user)" do
        log_in_as_user_factory(user_factory_name)

        old_username = @user1.username
        old_bio = @user1.bio
        new_username = "#{old_username}_blah"
        new_bio = "#{old_bio} blah"

        patch(
          user_url(@user1),
          as: :json,
          headers: @auth_headers,
          params: {
            user: {
              username: @user1.username,
              bio: @user1.bio,
            },
          },
        )

        assert_response 403
        @user1.reload

        refute_equal(@user1.username, new_username)
        refute_equal(@user1.bio, new_bio)
      end

      test "should NOT destroy user (when #{state_description}) (as NOT the same user)" do
        log_in_as_user_factory(user_factory_name)

        assert_difference('User.count', 0) do
          delete user_url(@user1), as: :json, headers: @auth_headers
        end

        assert_response 403
      end
    else
      test "should NOT update user without a password change (when #{state_description}) (as NOT the same user)" do
        log_in_as_user_factory(user_factory_name)

        old_username = @user1.username
        old_bio = @user1.bio
        new_username = "#{old_username}_blah"
        new_bio = "#{old_bio} blah"

        patch(
          user_url(@user1),
          as: :json,
          headers: @auth_headers,
          params: {
            user: {
              username: @user1.username,
              bio: @user1.bio,
            },
          },
        )

        assert_response(user_factory_name.nil? ? 401 : 403)
        @user1.reload

        refute_equal(@user1.username, new_username)
        refute_equal(@user1.bio, new_bio)
      end

      test "should NOT destroy user (when #{state_description}) (as NOT the same user)" do
        log_in_as_user_factory(user_factory_name)

        assert_difference('User.count', 0) do
          delete user_url(@user1), as: :json, headers: @auth_headers
        end

        assert_response(user_factory_name.nil? ? 401 : 403)
      end
    end
  end

  test "should NOT update user if the new username is non-unique" do
    user2 = users(:user2)
    log_in_as_user(@user1)

    patch(
      user_url(@user1),
      as: :json,
      headers: @auth_headers,
      params: {
        user: {
          username: user2.username,
          bio: @user1.bio,
        },
      },
    )

    assert_response 422

    response_json = JSON.parse(response.body)
    assert_predicate(response_json["errors"], :present?)
    assert_predicate(response_json["errors"].count, :positive?)
  end

  test "should update user with a password change if the old password was supplied correctly" do
    assert(@user1.authenticate("password123"))
    refute(@user1.authenticate("foobar"))

    log_in_as_user(@user1)

    old_username = @user1.username
    old_bio = @user1.bio
    new_username = "#{old_username}_blah"
    new_bio = "#{old_bio} blah"

    patch(
      user_url(@user1),
      as: :json,
      headers: @auth_headers,
      params: {
        user: {
          username: new_username,
          bio: new_bio,
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
    assert_equal(@user1.bio, new_bio)
  end

  test "should NOT update user with a password change if the old password was supplied incorrectly" do
    assert(@user1.authenticate("password123"))
    refute(@user1.authenticate("foobar"))

    log_in_as_user(@user1)

    old_username = @user1.username
    old_bio = @user1.bio
    new_username = "#{old_username}_blah"
    new_bio = "#{old_bio} blah"

    patch(
      user_url(@user1),
      as: :json,
      headers: @auth_headers,
      params: {
        user: {
          username: new_username,
          bio: new_bio,
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
    refute_equal(@user1.bio, new_bio)
  end
end
