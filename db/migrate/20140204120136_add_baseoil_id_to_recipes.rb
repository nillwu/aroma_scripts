class AddBaseoilIdToRecipes < ActiveRecord::Migration
  def change
    add_column :recipes, :baseoil_id, :integer
  end
end
