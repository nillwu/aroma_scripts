class Recipe < ActiveRecord::Base
  has_many :oils, foreign_key: "recipe_id", dependent: :destroy
  belongs_to :baseoil
  validates :baseoil, :name, :ml, :mol, presence: true
end
