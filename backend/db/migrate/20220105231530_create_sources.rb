class CreateSources < ActiveRecord::Migration[7.0]
  def change
    create_table :sources do |t|
      t.string :path, null: false, index: { unique: true }
      t.belongs_to :submitter, null: true
      t.integer :karma_cache, default: 0

      t.timestamps
    end

    add_foreign_key :sources, :users, column: :submitter_id, on_delete: :nullify
  end
end
