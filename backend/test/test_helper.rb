ENV['RAILS_ENV'] ||= 'test'
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods

  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...

  def log_in_as_user(user, password = "password123")
    return if user.blank?

    post(
      sessions_url,
      as: :json,
      params: {
        user: {
          username: user.username,
          password: password,
        },
      },
    )

    response_data = JSON.parse(response.body)
    @auth_headers = (@auth_headers || {}).merge({
      "Authorization" => "Bearer #{response_data['access_token']}",
    })

    user
  end

  def log_in_as_user_factory(user_factory_name)
    log_in_as_user(create(user_factory_name)) if user_factory_name
  end
end
