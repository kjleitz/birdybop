class ChangeColumnKarmaCacheToKarmaOnComments < ActiveRecord::Migration[7.0]
  def change
    rename_column :comments, :karma_cache, :karma
  end
end
