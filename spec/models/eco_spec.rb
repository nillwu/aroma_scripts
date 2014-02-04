require 'spec_helper'

describe Eco do
  before {@eco = Eco.new(name: "茶樹")}
  subject {@eco}
  it { should respond_to(:name)}
  it { should be_valid }
  
  describe "精油名稱是惟一的" do
    before do
      eco_with_same_name = @eco.dup
      eco_with_same_name.name = @eco.name
      eco_with_same_name.save
    end
    it { should_not be_valid }
  end
  
  describe "精油名稱是空白" do
    before do
      @eco = Eco.new(name: "")
    end
    it { should_not be_valid }
  end
  
end
  


