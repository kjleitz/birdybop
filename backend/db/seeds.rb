# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

if Rails.env.development?
  record_counts = {
    admin_user: 1,
    mod_user: 3,
    user: 9,
  }

  record_counts.each do |factory_name, record_count|
    record_count.times { FactoryBot.create(factory_name) }
  end
end
