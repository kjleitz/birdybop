class SourcesController < ApplicationController
  before_action :require_authentication, except: [:index, :show]

  # GET /sources
  def index
    sources = policy_scope(Source.all)
    render json: sources
  end

  # GET /sources/1
  def show
    source = Source.find(params[:id])
    authorize(source)
    render json: source
  end

  # POST /sources
  def create
    source = current_user.sources.new(source_params)
    authorize(source)

    if source.save
      render json: source, status: :created, location: source
    else
      render_errors source
    end
  end

  # PATCH/PUT /sources/1
  def update
    source = Source.find(params[:id])
    authorize(source)

    if source.update(source_params)
      render json: source
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
