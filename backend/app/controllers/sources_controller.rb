class SourcesController < ApplicationController
  before_action :require_authentication, except: [:index, :show]

  # GET /sources
  def index
    sources = policy_scope(Source.all)
    source_votes = if logged_in?
      SourceVote.where(source: sources, user: current_user).pluck(:source_id, :upvote)
    else
      []
    end

    render json: SourceSerializer.new(sources, is_collection: true, meta: { source_votes: source_votes }).as_json
  end

  # GET /sources/1
  def show
    source = if Utils.numeric?(params[:id])
      Source.find(params[:id])
    else
      encoded_source_path = params[:id]
      path = Utils.decode_uri_component_base64(encoded_source_path)
      source_for_path = Source.where(path: path).first_or_initialize

      if source_for_path.new_record?
        page_info = Source.fetch_page_info_for_path(path)
        source_for_path.name = page_info[:title]
        source_for_path.description = page_info[:description]
        source_for_path.submitter = current_user
      end

      source_for_path
    end

    authorize(source)
    render json: SourceSerializer.new(source).as_json
  end

  # POST /sources
  def create
    source = current_user.sources.new(source_params)
    authorize(source)

    if source.save
      # source.upvote!(current_user)
      # source.crawl!
      render json: SourceSerializer.new(source).as_json, status: :created, location: source
    else
      render_errors source
    end
  end

  # PATCH/PUT /sources/1
  def update
    source = Source.find(params[:id])
    authorize(source)

    if source.update(source_params)
      render json: SourceSerializer.new(source).as_json
    else
      render_errors source
    end
  end

  # DELETE /sources/1
  def destroy
    source = Source.find(params[:id])
    authorize(source)

    if source.destroy
      render status: :no_content
    else
      render_errors source
    end
  end

  private

  def source_params
    params.require(:source).permit(:name, :description, :path)
  end
end
