class SourceVote < ApplicationRecord
  belongs_to :source
  belongs_to :user

  validates :source, presence: true, uniqueness: { scope: :user_id }
  validates :user, presence: true, uniqueness: { scope: :source_id }
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
      Source.increment_counter(:karma, source_id)
    else
      Source.decrement_counter(:karma, source_id)
    end
  end

  def update_karma!
    old_state, new_state = saved_changes["upvote"] || []
    return if old_state == new_state

    if new_state
      2.times { Source.increment_counter(:karma, source_id) }
    else
      2.times { Source.decrement_counter(:karma, source_id) }
    end
  end

  def destroy_karma!
    if upvote?
      Source.decrement_counter(:karma, source_id)
    else
      Source.increment_counter(:karma, source_id)
    end
  end
end
