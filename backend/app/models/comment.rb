class Comment < ApplicationRecord
  belongs_to :author, optional: true, class_name: "User", inverse_of: :comments
  belongs_to :parent, optional: true, class_name: "Comment", inverse_of: :children
  belongs_to :source

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
end
