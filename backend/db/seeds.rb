# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

if Rails.env.development?
  # User.create(username: "admin", password: "admin", role: :admin, about: "this guy's an admin")
  # User.create(username: "mod1", password: "moderator", role: :moderator, about: "this guy's a mod")
  # User.create(username: "mod2", password: "moderator", role: :moderator, about: "this guy's a mod")
  # User.create(username: "mod3", password: "moderator", role: :moderator, about: "this guy's a mod")
  # User.create(username: "user1", password: "peasant", role: :peasant, about: "this guy's a peasant")
  # User.create(username: "user2", password: "peasant", role: :peasant, about: "this guy's a peasant")
  # User.create(username: "user3", password: "peasant", role: :peasant, about: "this guy's a peasant")
  system "rake db:fixtures:load" # I'm an asshole
end
