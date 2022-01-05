FactoryBot.define do
  factory :user, class: "User" do
    sequence(:username) { |n| "user_#{n}" }
    about { "whoa how'd I get here?" }
    password { "password123" }

    factory :admin_user do
      role { User.roles[:admin] }
    end

    factory :mod_user do
      role { User.roles[:moderator] }
    end
  end
end
