FactoryBot.define do
  factory :source_page do
    association :source, factory: :source
    sequence(:url) { |n| "#{source.path}/foobar/#{n}.html" }
    sequence(:document) do |n|
      <<~HTML
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Greetr</title>
          </head>
          <body>
            <h1>Greetings</h1>
            <h2>You are the #{n.ordinalize} visitor</h2>
            <p>...hi.</p>
          </body>
        </html>
      HTML
    end
  end
end
