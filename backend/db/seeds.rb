# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

if Rails.env.development?
  create_factory_records = lambda do |factory_name, record_count = 1|
    puts "Creating #{record_count} #{factory_name.to_s.humanize.downcase} #{'record'.pluralize(record_count)}"
    record_count.times { FactoryBot.create(factory_name) }
  end

  user_records = {
    admin_user: 1,
    mod_user: 3,
    peasant_user: 9,
  }

  user_records.each do |factory_name, record_count|
    create_factory_records.call(factory_name, record_count)
  end

  create_factory_records.call(:wikipedia)
  create_factory_records.call(:reddit)

  Source.all.each.with_index do |source, index|
    puts "Creating karma for source '#{source.name}'..."

    rand(30).times do
      FactoryBot.create(
        :source_upvote,
        source: source,
      )
    end

    rand(15).times do
      FactoryBot.create(
        :source_downvote,
        source: source,
      )
    end

    puts "Creating comments for source '#{source.name}'..."

    comment = FactoryBot.create(
      :comment,
      source: source,
      body: "This is BirdyBop's #{(index + 1).ordinalize} comment",
    )

    puts "Creating comment karma for source '#{source.name}'..."

    rand(10).times do
      FactoryBot.create(
        :comment_upvote,
        comment: comment,
      )
    end

    rand(5).times do
      FactoryBot.create(
        :comment_downvote,
        comment: comment,
      )
    end
  end
end
