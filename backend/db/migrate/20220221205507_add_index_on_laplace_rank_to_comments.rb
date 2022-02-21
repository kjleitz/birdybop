class AddIndexOnLaplaceRankToComments < ActiveRecord::Migration[7.0]
  def change
    add_index :comments, :laplace_rank
  end
end
