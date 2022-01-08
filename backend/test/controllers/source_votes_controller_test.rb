require "test_helper"

class SourceVotesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:user1)
    @source = sources(:wikipedia)
  end

  test "should upvote a source" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => 1) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should NOT upvote a source when not logged in" do
    assert_difference(-> { @source.reload.karma } => 0) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :unauthorized
    end
  end

  test "should downvote a source" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => -1) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should NOT downvote a source when not logged in" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => -1) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should modify a previous upvote when downvoting" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => 1) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    source_vote = SourceVote.last
    assert_equal(source_vote.upvote, true)

    assert_difference(-> { @source.reload.karma } => -2) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_equal(source_vote.reload.upvote, false)
  end

  test "should modify a previous downvote when upvoting" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => -1) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @source.reload.karma } => 2) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should NOT be able to upvote a source twice" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => 1) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @source.reload.karma } => 0) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :forbidden
    end
  end

  test "should NOT be able to downvote a source twice" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => -1) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @source.reload.karma } => 0) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :forbidden
    end
  end

  test "should remove an upvote" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => 1) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: true } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @source.reload.karma } => -1) do
      delete source_source_votes_url(@source), as: :json, headers: @auth_headers
      assert_response :no_content
    end
  end

  test "should remove a downvote" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => -1) do
      post(
        source_source_votes_url(@source),
        params: { source_vote: { upvote: false } },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    assert_difference(-> { @source.reload.karma } => 1) do
      delete source_source_votes_url(@source), as: :json, headers: @auth_headers
      assert_response :no_content
    end
  end

  test "should NOT remove an upvote that was never created" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => 0) do
      delete source_source_votes_url(@source), as: :json, headers: @auth_headers
      assert_response :not_found
    end
  end

  test "should NOT remove a downvote that was never created" do
    log_in_as_user_factory(:peasant_user)

    assert_difference(-> { @source.reload.karma } => 0) do
      delete source_source_votes_url(@source), as: :json, headers: @auth_headers
      assert_response :not_found
    end
  end
end
