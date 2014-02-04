class Baseoil < ActiveRecord::Base
  has_many :recipes
  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
