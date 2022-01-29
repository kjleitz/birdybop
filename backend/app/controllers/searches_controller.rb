class SearchesController < ApplicationController
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def search
    base_url = ENV.fetch("SEARCHER_BASE_URL") { "http://searx:8080" }
    url = URI.join(base_url, "search")
    resp = Faraday.get(
      url,
      {
        q: params["q"],
        format: "json",
      },
      {
        "Accept" => "application/json",
        "Content-Type" => "application/x-www-form-urlencoded",
      },
    )

    render json: resp.body, status: resp.status
  end
end
