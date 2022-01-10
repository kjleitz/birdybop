require "test_helper"

class SourcePagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @source = sources(:wikipedia)
    document = <<~HTML
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Some document</title>
        </head>
        <body>
          <p>bruh</p>
        </body>
      </html>
    HTML

    @source_page = @source.source_pages.create(
      document: document,
      url: "#{@source.path}/whatever",
    )
  end

  test "should get index" do
    get source_source_pages_url(@source), as: :json
    assert_response :success
  end

  test "should create source_page (when logged in as admin)" do
    log_in_as_user_factory(:admin_user)

    document = <<~HTML
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Some document</title>
        </head>
        <body>
          <p>sup</p>
        </body>
      </html>
    HTML

    url = "#{@source.path}/foobar"

    assert_difference("SourcePage.count", 1) do
      post(
        source_source_pages_url(@source),
        params: {
          source_page: {
            document: document,
            url: url,
          },
        },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :created
    end

    source_page = SourcePage.last
    assert_equal(source_page.document, document)
    assert_equal(source_page.url, url)
  end

  test "should NOT create source_page (when logged in as peasant)" do
    log_in_as_user_factory(:peasant_user)

    document = <<~HTML
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Some document</title>
        </head>
        <body>
          <p>sup</p>
        </body>
      </html>
    HTML

    url = "#{@source.path}/foobar"

    assert_difference("SourcePage.count", 0) do
      post(
        source_source_pages_url(@source),
        params: {
          source_page: {
            document: document,
            url: url,
          },
        },
        as: :json,
        headers: @auth_headers,
      )

      assert_response :forbidden
    end
  end

  test "should NOT create source_page (when not logged in)" do
    document = <<~HTML
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Some document</title>
        </head>
        <body>
          <p>sup</p>
        </body>
      </html>
    HTML

    url = "#{@source.path}/foobar"

    assert_difference("SourcePage.count", 0) do
      post(
        source_source_pages_url(@source),
        params: {
          source_page: {
            document: document,
            url: url,
          },
        },
        as: :json,
      )

      assert_response :unauthorized
    end
  end

  test "should show source_page" do
    get source_page_url(@source_page), as: :json
    assert_response :success
  end

  test "should update source_page (when logged in as admin)" do
    log_in_as_user_factory(:admin_user)

    document = "#{@source_page.document}<!-- foobar -->"
    url = "#{@source_page.url}/123"

    patch(
      source_page_url(@source_page),
      params: {
        source_page: {
          document: document,
          url: url,
        },
      },
      as: :json,
      headers: @auth_headers,
    )

    assert_response :success
    @source_page.reload

    assert_equal(@source_page.document, document)
    assert_equal(@source_page.url, url)
  end

  test "should NOT update source_page (when logged in as peasant)" do
    log_in_as_user_factory(:peasant_user)

    document = "#{@source_page.document}<!-- foobar -->"
    url = "#{@source_page.url}/123"

    patch(
      source_page_url(@source_page),
      params: {
        source_page: {
          document: document,
          url: url,
        },
      },
      as: :json,
      headers: @auth_headers,
    )

    assert_response :forbidden
    @source_page.reload

    refute_equal(@source_page.document, document)
    refute_equal(@source_page.url, url)
  end

  test "should NOT update source_page (when not logged in)" do
    document = "#{@source_page.document}<!-- foobar -->"
    url = "#{@source_page.url}/123"

    patch(
      source_page_url(@source_page),
      params: {
        source_page: {
          document: document,
          url: url,
        },
      },
      as: :json,
    )

    assert_response :unauthorized
    @source_page.reload

    refute_equal(@source_page.document, document)
    refute_equal(@source_page.url, url)
  end

  test "should destroy source_page (when logged in as admin)" do
    log_in_as_user_factory(:admin_user)

    assert_difference("SourcePage.count", -1) do
      delete source_page_url(@source_page), as: :json, headers: @auth_headers
      assert_response :no_content
    end
  end

  test "should NOT destroy source_page (when logged in as peasant)" do
    log_in_as_user_factory(:peasant_user)

    assert_difference("SourcePage.count", 0) do
      delete source_page_url(@source_page), as: :json, headers: @auth_headers
      assert_response :forbidden
    end
  end

  test "should NOT destroy source_page (when not logged in)" do
    assert_difference("SourcePage.count", 0) do
      delete source_page_url(@source_page), as: :json
      assert_response :unauthorized
    end
  end
end
