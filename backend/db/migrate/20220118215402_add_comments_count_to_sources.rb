class AddCommentsCountToSources < ActiveRecord::Migration[7.0]
  def change
    add_column :sources, :comments_count, :integer
  end
end
