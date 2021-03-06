class CommentsController < ApplicationController
  before_action :require_authentication, except: [:index, :show]

  # GET /sources/1/comments
  def index
    source = find_source(params[:source_id])
    comments = policy_scope(source.present? ? source.comments : Comment.none).sorted_by_best

    comment_votes = if logged_in?
      CommentVote.where(comment: comments, user: current_user)
    else
      []
    end

    comment_votes_data = CommentVoteSerializer.new(comment_votes, is_collection: true).as_json

    comments_data = CommentSerializer.new(
      comments,
      is_collection: true,
      meta: { currentUserCommentVotes: comment_votes_data },
    ).as_json

    render json: comments_data
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
        # comment.create_initial_upvote!
        # comment.reload
        render json: CommentSerializer.new(comment).as_json, status: :created, location: comment
      else
        render_errors comment
      end
    else
      render_unprocessable_entity "Source ID must be encoded source path" and return if Utils.numeric?(params[:source_id])

      encoded_source_path = params[:source_id]
      encoded_source_url = params[:source_url]
      path = Utils.decode_uri_component_base64(encoded_source_path)
      url = Utils.decode_uri_component_base64(encoded_source_url) if encoded_source_url.present?
      page_info = Source.fetch_page_info_for_url(url || Source.uri(path).to_s)
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

        # comment.create_initial_upvote!
        # comment.reload
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

    old_body = comment.body
    comment.assign_attributes(comment_params)
    comment.edited_at = Time.zone.now if comment.body != old_body

    if comment.save
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
