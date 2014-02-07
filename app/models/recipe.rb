class Recipe < ActiveRecord::Base
  has_many :oils, foreign_key: "recipe_id", dependent: :destroy
  has_many :effect_ecos, through: :oils
  has_many :ecos, through: :effect_ecos
  has_many :aroma_effects, through: :effect_ecos
  belongs_to :baseoil
  validates :baseoil, :name, :ml, :mol, presence: true
  accepts_nested_attributes_for :oils, :effect_ecos, :ecos, :aroma_effects, :baseoil
  def name_with_initial
    "#{name}. #{name}"
  end
end
