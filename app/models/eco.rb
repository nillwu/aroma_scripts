class Eco < ActiveRecord::Base
  has_many :effect_ecos, foreign_key: "eco_id", dependent: :destroy
  has_many :aroma_effects, :through => :effect_ecos
  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
