class RenameAboutToBioOnUsers < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :about, :bio
  end
end
