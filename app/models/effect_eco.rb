class EffectEco < ActiveRecord::Base
  belongs_to :aroma_effect, class_name: "AromaEffect"
  belongs_to :eco, class_name: "Eco"
  validates :eco, presence: true
  validates :aroma_effect, presence: true
end
