FactoryBot.define do
  factory :comment do
    association :author, factory: :peasant_user
    association :source, factory: :source
    sequence(:body) { |n| "This is my #{n.ordinalize} comment" }
    section { Comment.sections[:discussion] }
    # comment_votes { [association(:comment_upvote), association(:comment_downvote), association(:comment_upvote)] }

    factory :child_comment do
      association :parent, factory: :comment
      source { parent.source }
    end

    factory :parent_comment do
      children { [association(:post), association(:post)] }
    end
  end
end
