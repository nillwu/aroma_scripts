class CreateEffectEcos < ActiveRecord::Migration
  def change
    create_table :effect_ecos do |t|
      t.integer :aroma_effect_id
      t.integer :eco_id
      t.integer :elevel

      t.timestamps
    end
    add_index :effect_ecos, [:aroma_effect_id, :eco_id], unique: true
  end
end
