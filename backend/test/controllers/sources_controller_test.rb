require "test_helper"

class SourcesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @source = sources(:wikipedia)
  end

  test "should get index" do
    get sources_url, as: :json
    assert_response :success
  end

  test "should create source" do
    log_in_as_user_factory(:peasant_user)

    assert_difference("Source.count", 1) do
      post(
        sources_url,
        params: {
          source: {
            name: "Foobar",
            path: "foobar.com",
          },
        },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end
  end

  test "should NOT create source with a non-unique path" do
    log_in_as_user_factory(:peasant_user)

    assert_difference("Source.count", 0) do
      post(
        sources_url,
        params: {
          source: {
            name: "Foobar",
            path: sources(:wikipedia).path,
          },
        },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :unprocessable_entity
    end
  end

  test "should show source" do
    get source_url(@source), as: :json
    assert_response :success
  end

  test "should NOT update source (when logged in as peasant)" do
    log_in_as_user_factory(:peasant_user)

    old_path = @source.path
    new_path = "poop.#{@source.path}"

    patch(
      source_url(@source),
      params: {
        source: {
          path: new_path,
        },
      },
      as: :json,
      headers: @auth_headers,
    )

    assert_response :forbidden
    @source.reload

    assert_equal(@source.path, old_path)
  end

  test "should update source (when logged in as admin)" do
    log_in_as_user_factory(:admin_user)

    new_path = "poop.#{@source.path}"

    patch(
      source_url(@source),
      params: {
        source: {
          path: new_path,
        },
      },
      as: :json,
      headers: @auth_headers,
    )

    assert_response :success
    @source.reload

    assert_equal(@source.path, new_path)
  end

  test "should NOT destroy source (when logged in as peasant)" do
    log_in_as_user_factory(:peasant_user)

    assert_difference("Source.count", 0) do
      delete source_url(@source), as: :json, headers: @auth_headers
      assert_response :forbidden
    end
  end

  test "should destroy source (when logged in as admin)" do
    log_in_as_user_factory(:admin_user)

    assert_difference("Source.count", -1) do
      delete source_url(@source), as: :json, headers: @auth_headers
      assert_response :no_content
    end
  end
end
