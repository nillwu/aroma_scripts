class CreateEcos < ActiveRecord::Migration
  def change
    create_table :ecos do |t|
      t.string :name

      t.timestamps
    end
  end
end
