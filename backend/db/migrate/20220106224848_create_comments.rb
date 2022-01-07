class CreateComments < ActiveRecord::Migration[7.0]
  def change
    create_table :comments do |t|
      t.text :body, null: false
      t.integer :section, null: false

      t.belongs_to :author, null: true
      t.belongs_to :parent, null: true, foreign_key: { to_table: :comments }
      t.belongs_to :source, null: false, foreign_key: true

      t.timestamps
    end

    add_foreign_key :comments, :users, column: :author_id, on_delete: :nullify
  end
end
