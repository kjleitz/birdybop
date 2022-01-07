class CreateCommentVotes < ActiveRecord::Migration[7.0]
  def change
    create_table :comment_votes do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :comment, null: false, foreign_key: true
      t.boolean :upvote, null: false

      t.index [:user_id, :comment_id], unique: true
      t.index [:comment_id, :user_id], unique: true

      t.timestamps
    end
  end
end
