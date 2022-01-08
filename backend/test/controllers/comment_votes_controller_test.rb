require "test_helper"

class CommentVotesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:user1)
    @comment = comments(:one)
  end

  test "should upvote a comment" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => 1) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should NOT upvote a comment when not logged in" do
    assert_difference(-> { @comment.reload.karma } => 0) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :unauthorized
    end
  end

  test "should downvote a comment" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => -1) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should NOT downvote a comment when not logged in" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => -1) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should modify a previous upvote when downvoting" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => 1) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @comment.reload.karma } => -2) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should modify a previous downvote when upvoting" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => -1) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @comment.reload.karma } => 2) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should NOT be able to upvote a comment twice" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => 1) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @comment.reload.karma } => 0) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :forbidden
    end
  end

  test "should NOT be able to downvote a comment twice" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => -1) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @comment.reload.karma } => 0) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :forbidden
    end
  end

  test "should remove an upvote" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => 1) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @comment.reload.karma } => -1) do
      delete comment_comment_votes_url(@comment), as: :json, headers: @auth_headers
      assert_response :no_content
    end
  end

  test "should remove a downvote" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => -1) do
      post(
        comment_comment_votes_url(@comment),
        params: { comment_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @comment.reload.karma } => 1) do
      delete comment_comment_votes_url(@comment), as: :json, headers: @auth_headers
      assert_response :no_content
    end
  end

  test "should NOT remove an upvote that was never created" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => 0) do
      delete comment_comment_votes_url(@comment), as: :json, headers: @auth_headers
      assert_response :not_found
    end
  end

  test "should NOT remove a downvote that was never created" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @comment.reload.karma } => 0) do
      delete comment_comment_votes_url(@comment), as: :json, headers: @auth_headers
      assert_response :not_found
    end
  end
end
