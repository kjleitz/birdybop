class CommentsController < ApplicationController
  before_action :require_authentication, except: [:index, :show]

  # GET /sources/1/comments
  def index
    source = Source.find(params[:source_id])
    comments = policy_scope(source.comments)
    render json: comments
  end

  # GET /comments/1
  def show
    comment = Comment.find(params[:id])
    authorize(comment)
    render json: comment
  end

  # POST /sources/1/comments
  def create
    comment = current_user.comments.build(comment_params)
    comment.source_id = params[:source_id]
    authorize(comment)

    if comment.save
      render json: comment, status: :created, location: comment
    else
      render_errors comment
    end
  end

  # PATCH/PUT /comments/1
  def update
    comment = Comment.find(params[:id])
    authorize(comment)

    if comment.update(comment_params)
      render json: comment
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
end
