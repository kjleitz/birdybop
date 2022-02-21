class AddVoteCountsToComments < ActiveRecord::Migration[7.0]
  def change
    add_column :comments, :upvote_count, :integer, default: 0
    add_column :comments, :downvote_count, :integer, default: 0
    add_column :comments, :laplace_rank, :float, default: 0
  end
end
