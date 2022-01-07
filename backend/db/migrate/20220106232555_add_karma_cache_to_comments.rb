class AddKarmaCacheToComments < ActiveRecord::Migration[7.0]
  def change
    add_column :comments, :karma_cache, :integer, default: 0
  end
end
