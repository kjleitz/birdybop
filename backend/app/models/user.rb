class User < ApplicationRecord
  has_secure_password

  has_many :sources, foreign_key: :submitter_id, inverse_of: :submitter, dependent: :nullify
  has_many :comments, foreign_key: :author_id, inverse_of: :author, dependent: :nullify
  has_many :comment_votes, dependent: :destroy
  has_many :source_votes, dependent: :destroy

  enum role: {
    peasant: 0,
    admin: 1,
    moderator: 2,
  }

  validates :username,
    presence: true,
    uniqueness: {
      case_sensitive: false,
    },
    format: {
      with: /\A[a-zA-Z0-9_-]+\z/,
      message: "may only include letters, numbers, underscores, and/or hyphens",
    }
end
