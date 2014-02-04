class CreateAromaEffects < ActiveRecord::Migration
  def change
    create_table :aroma_effects do |t|
      t.string :name

      t.timestamps
    end
  end
end
