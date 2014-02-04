require 'spec_helper'

describe AromaEffect do
  before {@aromaeffect = AromaEffect.new(name: "助消化")}
  subject {@aromaeffect}
  it { should respond_to(:name)}
  it { should be_valid }
  
  describe "藥學屬性是惟一的" do
    before do
      aromaeffect_with_same_name = @aromaeffect.dup
      aromaeffect_with_same_name.name = @aromaeffect.name
      aromaeffect_with_same_name.save
    end
    it { should_not be_valid }
  end
  
  describe "藥學屬性是空白" do
    before do
      @aromaeffect = AromaEffect.new(name: "")
    end
    it { should_not be_valid }
  end
end
