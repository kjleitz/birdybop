class SourcePagesController < ApplicationController
  before_action :require_authentication, except: [:index, :show]

  # GET /sources/1/source_pages
  def index
    source = Source.find(params[:source_id])
    source_pages = policy_scope(source.source_pages)
    render json: SourcePageSerializer.new(source_pages, is_collection: true).as_json
  end

  # GET /source_pages/1
  def show
    source_page = SourcePage.find(params[:id])
    authorize(source_page)
    render json: SourcePageSerializer.new(source_page).as_json
  end

  # POST /sources/1/source_pages
  def create
    source = Source.find(params[:source_id])
    source_page = source.source_pages.build(source_page_params)
    authorize(source_page)

    if source_page.save
      render json: SourcePageSerializer.new(source_page), status: :created, location: source_page
    else
      render_errors source_page
    end
  end

  # PATCH/PUT /source_pages/1
  def update
    source_page = SourcePage.find(params[:id])
    authorize(source_page)

    if source_page.update(source_page_params)
      render json: source_page
    else
      render_errors source_page
    end
  end

  # DELETE /source_pages/1
  def destroy
    source_page = SourcePage.find(params[:id])
    authorize(source_page)

    if source_page.destroy
      render status: :no_content
    else
      render_errors source_page
    end
  end

  private

  # Only allow a list of trusted parameters through.
  def source_page_params
    params.require(:source_page).permit(:document, :url)
  end
end
