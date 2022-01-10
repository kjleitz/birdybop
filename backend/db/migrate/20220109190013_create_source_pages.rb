class CreateSourcePages < ActiveRecord::Migration[7.0]
  def change
    create_table :source_pages do |t|
      t.belongs_to :source, null: false, foreign_key: true
      t.text :document, null: false
      t.text :url, null: false

      t.timestamps
    end
  end
end
