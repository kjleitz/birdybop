class AddEditedAtToComments < ActiveRecord::Migration[7.0]
  def change
    add_column :comments, :edited_at, :timestamp, null: true
  end
end
