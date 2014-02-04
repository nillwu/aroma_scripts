require 'spec_helper'

describe Oil do
  let(:eco) { FactoryGirl.create(:eco) }
  let(:aroma_effect) { FactoryGirl.create(:aroma_effect) }
  let(:effect_eco) { aroma_effect.effect_ecos.create(eco_id: eco.id)}
  let(:recipe) { FactoryGirl.create(:recipe) }
  let(:oil) { recipe.oils.build(effect_eco_id: effect_eco.id, opercentage: 5,
   ospot: 100)}
  
  subject { oil }

  it { should be_valid }

  describe "oil methods" do
    it { should respond_to(:opercentage) }
    it { should respond_to(:ospot) }
    it { should respond_to(:recipe) }
    it { should respond_to(:effect_eco) }
    its(:recipe) { should eq recipe }
    its(:effect_eco) { should eq effect_eco }
  end

  describe "when recipe is not present" do
    before { oil.recipe_id = nil }
    it { should_not be_valid }
  end

 describe "when effect_eco is not present" do
    before { oil.effect_eco_id = nil }
    it { should_not be_valid }
  end
end


