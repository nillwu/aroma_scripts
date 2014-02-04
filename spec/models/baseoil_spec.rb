require 'spec_helper'

describe Baseoil do
  before {@baseoil = Baseoil.new(name: "Jojoba")}
  subject {@baseoil}
  it { should respond_to(:name)}
  it { should be_valid }
  
  describe "基底油的名字是惟一的" do
    before do
      baseoil_with_same_name = @baseoil.dup
      baseoil_with_same_name.name = @baseoil.name
      baseoil_with_same_name.save
    end
    it { should_not be_valid }
  end
  
  describe "名稱是空白" do
    before do
      @baseoil = Baseoil.new(name: "")
    end
    it { should_not be_valid }
  end
end
