class AddNameAndDescriptionToSources < ActiveRecord::Migration[7.0]
  def change
    add_column :sources, :name, :string, null: false
    add_column :sources, :description, :text, default: ""
  end
end
