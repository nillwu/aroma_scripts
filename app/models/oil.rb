class Oil < ActiveRecord::Base
  belongs_to :recipe
  belongs_to :effect_eco
  validates :recipe, presence: true
  validates :effect_eco, presence: true
end
