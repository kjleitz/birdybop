FactoryBot.define do
  factory :source_vote do
    association :source, factory: :source
    association :user, factory: :peasant_user
    upvote { true }

    factory :source_upvote do
      upvote { true }
    end

    factory :source_downvote do
      upvote { false }
    end
  end
end
