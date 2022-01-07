class SourceVote < ApplicationRecord
  belongs_to :source
  belongs_to :user

  validates :source, presence: true, uniqueness: { scope: :user_id }
  validates :user, presence: true, uniqueness: { scope: :source_id }
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
      Source.increment_counter(:karma, source_id)
    else
      Source.decrement_counter(:karma, source_id)
    end
  end
end
