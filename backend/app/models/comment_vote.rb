class CommentVote < ApplicationRecord
  belongs_to :comment
  belongs_to :user

  validates :comment, presence: true, uniqueness: { scope: :user_id }
  validates :user, presence: true, uniqueness: { scope: :comment_id }
  validates :upvote, inclusion: [true, false]

  scope :upvotes, -> { where(upvote: true) }
  scope :downvotes, -> { where(upvote: false) }

  after_commit :create_karma!, on: :create
  after_commit :update_karma!, on: :update
  after_commit :destroy_karma!, on: :destroy

  def downvote?
    !upvote?
  end

  def downvote=(value)
    self.upvote = !value
  end

  private

  def create_karma!
    if upvote?
      Comment.increment_counter(:karma, comment_id)
    else
      Comment.decrement_counter(:karma, comment_id)
    end
  end

  def update_karma!
    old_state, new_state = saved_changes["upvote"] || []
    return if old_state == new_state

    if new_state
      2.times { Comment.increment_counter(:karma, comment_id) }
    else
      2.times { Comment.decrement_counter(:karma, comment_id) }
    end
  end

  def destroy_karma!
    if upvote?
      Comment.decrement_counter(:karma, comment_id)
    else
      Comment.increment_counter(:karma, comment_id)
    end
  end
end
