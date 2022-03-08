class Comment < ApplicationRecord
  belongs_to :author, optional: true, class_name: "User", inverse_of: :comments
  belongs_to :parent, optional: true, class_name: "Comment", inverse_of: :children, counter_cache: :comments_count
  belongs_to :source, counter_cache: true

  has_many :children, class_name: "Comment", foreign_key: :parent_id, inverse_of: :parent
  has_many :comment_votes, dependent: :destroy

  enum section: {
    discussion: 0,
    q_and_a: 1,
    warnings: 2,
    tips: 3,
  }

  validates :section, presence: true
  validates :source, presence: true

  scope :sorted_by_best, -> { order(laplace_rank: :desc).order(created_at: :desc) }

  after_commit :create_initial_upvote!, on: :create

  class << self
    def update_laplace_rank!(comment_id)
      # Only grab the columns we need...
      comment_attrs = Comment.where(id: comment_id).select(:upvote_count, :downvote_count, :laplace_rank).first
      return if comment_attrs.blank?

      new_rank = Utils.laplace_rank(comment_attrs.upvote_count, comment_attrs.downvote_count)
      return if new_rank == comment_attrs.laplace_rank

      # Goes straight to the database, does not perform validations
      Comment.where(id: comment_id).update_all(laplace_rank: new_rank)
    end
  end

  def author_username
    author.username
  end

  def create_initial_upvote!
    vote = comment_votes.where(user: author).first_or_initialize
    return true if vote.persisted? && vote.upvote?

    vote.upvote = true
    vote.save!
  end

  # TODO: make this async and debounced, so multiple votes in a short period of
  #       time only update the rank once after, e.g., ten seconds.
  def update_laplace_rank!
    new_rank = Utils.laplace_rank(upvote_count, downvote_count)
    return true if new_rank == laplace_rank

    update!(laplace_rank: new_rank)
  end

  # Mostly just for use in a REPL while testing
  def set_vote_counts_from_reality!
    self.upvote_count = comment_votes.upvotes.count
    self.downvote_count = comment_votes.downvotes.count
    self.karma = upvote_count + downvote_count
    self.laplace_rank = Utils.laplace_rank(upvote_count, downvote_count)
    save!
  end
end
