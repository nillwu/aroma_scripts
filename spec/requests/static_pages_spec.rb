require 'spec_helper'

describe "Static pages" do
  subject {page}
  describe "首頁" do
    before {visit root_path}
    it{ should have_content('Aroma Scripts')} 
    it{ should have_title ('Aroma Scripts') }
     it { should_not have_title('| 首頁') }
  end
  
  describe "Help page" do
	before {visit help_path}
	it {should have_content('Help') }
  end
    
    
  describe "About page" do
	before {visit about_path}
    it {should have_content('About Us')} 
  end
end
