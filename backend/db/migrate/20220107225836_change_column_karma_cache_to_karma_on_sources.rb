class ChangeColumnKarmaCacheToKarmaOnSources < ActiveRecord::Migration[7.0]
  def change
    rename_column :sources, :karma_cache, :karma
  end
end
