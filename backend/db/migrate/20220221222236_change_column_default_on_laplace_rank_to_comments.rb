class ChangeColumnDefaultOnLaplaceRankToComments < ActiveRecord::Migration[7.0]
  def change
    change_column_default :comments, :laplace_rank, from: 0, to: 0.5
  end
end
