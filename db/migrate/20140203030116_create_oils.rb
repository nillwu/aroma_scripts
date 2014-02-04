class CreateOils < ActiveRecord::Migration
  def change
    create_table :oils do |t|
      t.float :opercentage
      t.integer :ospot
      t.integer :effect_eco_id
      t.integer :recipe_id

      t.timestamps
    end
  end
end
