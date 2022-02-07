FactoryBot.define do
  factory :source do
    path { "example.com" }
    name { path.gsub(/\A(https?:\/\/)?(www\.|en\.)?([^\/]+)(\/.*|\z)/i, '\3') }
    association :submitter, factory: :peasant_user
    # source_votes { [association(:source_upvote), association(:source_downvote), association(:source_upvote)] }
    # comments { [association(:comment), association(:parent_comment)] }
    # comments { [association(:comment)] }

    factory :wikipedia do
      path { "en.wikipedia.org" }
      name { "Wikipedia" }
      description { "The Free Encyclopedia" }
    end

    factory :reddit do
      path { "reddit.com" }
      name { "Reddit" }
      description { "The Front Page of the Internet" }
    end
  end
end
