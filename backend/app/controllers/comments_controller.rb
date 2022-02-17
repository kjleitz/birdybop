class CommentsController < ApplicationController
  before_action :require_authentication, except: [:index, :show]

  # GET /sources/1/comments
  def index
    source = find_source(params[:source_id])
    comments = policy_scope(source.present? ? source.comments : Comment.none)
    render json: CommentSerializer.new(comments, is_collection: true).as_json
  end

  # GET /comments/1
  def show
    comment = Comment.find(params[:id])
    authorize(comment)
    render json: CommentSerializer.new(comment).as_json
  end

  # TODO: this is awful, please refactor
  # POST /sources/1/comments
  def create
    source = find_source(params[:source_id])
    comment = current_user.comments.build(comment_params)
    authorize(comment)

    if source.present?
      comment.source = source
      if comment.save
        render json: CommentSerializer.new(comment).as_json, status: :created, location: comment
      else
        render_errors comment
      end
    else
      render_unprocessable_entity "Source ID must be encoded source path" and return if Utils.numeric?(params[:source_id])

      encoded_source_path = params[:source_id]
      path = Utils.decode_uri_component_base64(encoded_source_path)
      page_info = Source.fetch_page_info_for_path(path)
      title = page_info[:title]
      title = "#{title} (#{SecureRandom.hex})" if Source.where(name: title).exists?
      description = page_info[:description]

      source = current_user.sources.build(
        path: path,
        name: title,
        description: description,
      )

      begin
        ApplicationRecord.transaction do
          source.save!
          comment.source = source
          comment.save!
        end

        render json: CommentSerializer.new(comment).as_json, status: :created, location: comment
      rescue => e
        render_errors e
      end
    end
  end

  # PATCH/PUT /comments/1
  def update
    comment = Comment.find(params[:id])
    authorize(comment)

    if comment.update(comment_params)
      render json: CommentSerializer.new(comment).as_json
    else
      render_errors comment
    end
  end

  # DELETE /comments/1
  def destroy
    comment = Comment.find(params[:id])
    authorize(comment)

    if comment.destroy
      render status: :no_content
    else
      render_errors comment
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:parent_id, :body, :section)
  end

  def find_source(id_ish)
    return Source.find_by(id: id_ish) if Utils.numeric?(id_ish)

    path = Utils.decode_uri_component_base64(id_ish)
    Source.find_by(path: path)
  end
end
