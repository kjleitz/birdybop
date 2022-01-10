class SourcePage < ApplicationRecord
  belongs_to :source

  validates :document, presence: true
  validates :url, presence: true
end
