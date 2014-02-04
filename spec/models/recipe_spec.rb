require 'spec_helper'

describe Recipe do
  let(:baseoil) { FactoryGirl.create(:baseoil) }
  let(:recipe) { FactoryGirl.create(:recipe) }
  let(:aroma_effect) { FactoryGirl.create(:aroma_effect) }
  let(:effect_eco) { aroma_effect.effect_ecos.build(eco_id: eco.id)}

  subject { recipe }

  it { should be_valid }

  describe "Recipe methods" do
    it { should respond_to(:name) }
    it { should respond_to(:mol) }
    it { should respond_to(:ml) }
    it { should respond_to(:remark) }
    it { should respond_to(:baseoil) }
    #its(:eco) { should eq eco }
    #its(:aroma_effect) { should eq aroma_effect }
  end
  
  describe "when baseoil is not present" do
    before { recipe.baseoil_id = nil }
    it { should_not be_valid }
  end

  describe "when mol is not present" do
    before { recipe.mol = nil }
    it { should_not be_valid }
  end

  describe "when ml is not present" do
    before { recipe.ml = nil }
    it { should_not be_valid }
  end

  describe "when name is not present" do
    before { recipe.name = nil }
    it { should_not be_valid }
  end

end
