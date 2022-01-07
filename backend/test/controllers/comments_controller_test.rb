require "test_helper"

class CommentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @source = sources(:wikipedia)
    @comment = @source.comments.first
  end

  test "should get index" do
    get source_comments_url(@source), as: :json
    assert_response :success
  end

  test "should create comment (when logged in)" do
    log_in_as_user_factory(:peasant_user)

    assert_difference("Comment.count", 1) do
      post(
        source_comments_url(@source),
        params: {
          comment: {
            body: "this thing is jank",
            section: "warnings",
          },
        },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should NOT create comment (when NOT logged in)" do
    assert_difference("Comment.count", 0) do
      post(
        source_comments_url(@source),
        params: {
          comment: {
            body: "this thing is jank",
            section: "warnings",
          },
        },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :unauthorized
    end
  end

  test "should show comment" do
    get comment_url(@comment), as: :json
    assert_response :success
  end

  test "should update comment (when logged in as admin)" do
    log_in_as_user_factory(:admin_user)

    new_body = "#{@comment.body}\n\n**edit:** speeling"

    patch(
      comment_url(@comment),
      params: {
        comment: {
          body: new_body,
        },
      },
      as: :json,
      headers: @auth_headers,
    )

    assert_response :success
    @comment.reload

    assert_equal(@comment.body, new_body)
  end

  test "should update comment (when logged in as the same user)" do
    log_in_as_user(@comment.author)

    new_body = "#{@comment.body}\n\n**edit:** speeling"

    patch(
      comment_url(@comment),
      params: {
        comment: {
          body: new_body,
        },
      },
      as: :json,
      headers: @auth_headers,
    )

    assert_response :success
    @comment.reload

    assert_equal(@comment.body, new_body)
  end

  test "should NOT update comment (when logged in as a different user)" do
    log_in_as_user_factory(:peasant_user)

    new_body = "#{@comment.body}\n\n**edit:** speeling"

    patch(
      comment_url(@comment),
      params: {
        comment: {
          body: new_body,
        },
      },
      as: :json,
      headers: @auth_headers,
    )

    assert_response :forbidden
    @comment.reload

    refute_equal(@comment.body, new_body)
  end

  test "should destroy comment (when logged in as admin)" do
    log_in_as_user_factory(:admin_user)

    assert_difference("Comment.count", -1) do
      delete comment_url(@comment), as: :json, headers: @auth_headers
      assert_response :no_content
    end
  end

  test "should NOT destroy comment (when logged in as peasant)" do
    log_in_as_user_factory(:peasant_user)

    assert_difference("Comment.count", 0) do
      delete comment_url(@comment), as: :json, headers: @auth_headers
      assert_response :forbidden
    end
  end
end
