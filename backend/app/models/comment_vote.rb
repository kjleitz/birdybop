class CommentVote < ApplicationRecord
  belongs_to :comment
  belongs_to :user

  validates :comment, presence: true, uniqueness: { scope: :user_id }
  validates :user, presence: true, uniqueness: { scope: :comment_id }
  validates :upvote, inclusion: [true, false]

  scope :upvotes, -> { where(upvote: true) }
  scope :downvotes, -> { where(upvote: false) }

  after_commit :update_karma!, on: :create

  def downvote?
    !upvote?
  end

  def downvote=(value)
    self.upvote = !value
  end

  private

  def update_karma!
    if upvote?
      Comment.increment_counter(:karma, comment_id)
    else
      Comment.decrement_counter(:karma, comment_id)
    end
  end
end
