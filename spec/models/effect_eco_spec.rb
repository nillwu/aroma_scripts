require 'spec_helper'

describe EffectEco do
  let(:eco) { FactoryGirl.create(:eco) }
  let(:aroma_effect) { FactoryGirl.create(:aroma_effect) }
  let(:effect_eco) { aroma_effect.effect_ecos.build(eco_id: eco.id)}

  subject { effect_eco }

  it { should be_valid }

  describe "effect_eco methods" do
    it { should respond_to(:eco) }
    it { should respond_to(:aroma_effect) }
    its(:eco) { should eq eco }
    its(:aroma_effect) { should eq aroma_effect }
  end

  describe "when eco is not present" do
    before { effect_eco.eco_id = nil }
    it { should_not be_valid }
  end

 describe "when aroma_effect is not present" do
    before { effect_eco.aroma_effect_id = nil }
    it { should_not be_valid }
  end
end

