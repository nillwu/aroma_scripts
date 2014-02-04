class CreateRecipes < ActiveRecord::Migration
  def change
    create_table :recipes do |t|
      t.string :name
      t.float :mol
      t.integer :ml
      t.text :remark

      t.timestamps
    end
  end
end
