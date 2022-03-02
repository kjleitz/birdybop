class SearchesController < ApplicationController
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  # TODO: error handling
  def search
    base_url = ENV.fetch("SEARCHER_BASE_URL") { Rails.env.production? ? "https://birdybop-searx.herokuapp.com" : "http://searx:8080" }
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

    # If we attach the `#sources` relationship directly to the SearxResult
    # instances, and do an `include: [:sources]` in the serializer options, that
    # would be the "blessed path," but it does database queries for every single
    # one, multiple times, so it's crazy inefficient. Instead, we're going to
    # do a single database query to grab the relevant sources for all the
    # results, then assign `source_ids` to each SearxResult object (so that the
    # serializer can attach a basic list of thin `{ id: 123, type: "source" }`
    # objects to each data entry), and finally compute and add the "included"
    # data manually rather than using the `include: [:sources]` serializer
    # option. Single database query. Yay. Feels pretty dirty though.

    data = JSON.parse(resp.body)
    results = data["results"].map { |result| SearxResult.new(result) }
    path_families = results.map(&:path_family).flatten
    sources = Source.where(path: path_families)

    results.each do |result|
      result_path_family = result.path_family
      relevant_sources = sources.filter { |source| result_path_family.include?(source.path) }
      result.source_ids = relevant_sources.map(&:id)
    end

    serialized_results = SearxResultSerializer.new(results, is_collection: true).as_json
    included = sources.map { |source| SourceSerializer.new(source).as_json["data"] }
    serialized_results.merge!("included" => included)

    render json: serialized_results
  end
end
