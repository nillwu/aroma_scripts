class AromaEffect < ActiveRecord::Base
  has_many :effect_ecos, foreign_key: "aroma_effect_id", dependent: :destroy
  has_many :ecos, :through => :effect_ecos
  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
