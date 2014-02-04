class CreateBaseoils < ActiveRecord::Migration
  def change
    create_table :baseoils do |t|
      t.string :name

      t.timestamps
    end
  end
end
