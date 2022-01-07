FactoryBot.define do
  factory :comment_vote do
    association :comment, factory: :comment
    association :user, factory: :peasant_user
    upvote { true }

    factory :comment_upvote do
      upvote { true }
    end

    factory :comment_downvote do
      upvote { false }
    end
  end
end
