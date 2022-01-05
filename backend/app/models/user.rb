class User < ApplicationRecord
  has_secure_password

  validates :username,
    presence: true,
    uniqueness: true,
    format: {
      with: /\A[a-zA-Z0-9_-]+\z/,
      message: "may only include letters, numbers, underscores, and/or hyphens",
    }

  enum role: {
    peasant: 0,
    admin: 1,
    moderator: 2,
  }
end
