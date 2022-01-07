class CreateSourceVotes < ActiveRecord::Migration[7.0]
  def change
    create_table :source_votes do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :source, null: false, foreign_key: true
      t.boolean :upvote, null: false

      t.index [:user_id, :source_id], unique: true
      t.index [:source_id, :user_id], unique: true

      t.timestamps
    end
  end
end
