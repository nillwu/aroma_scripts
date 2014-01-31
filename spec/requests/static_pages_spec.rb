require 'spec_helper'

describe "Static pages" do
  subject {page}
  shared_examples_for "all static pages" do
    it {should have_content(heading)}
    it {should have_title(full_title(page_title))}
  end 
  
  it "should have the right links on the layout" do
    visit root_path
    click_link "About"
    expect(page).to have_title(full_title('About Us'))
  end
  
  
  describe "首頁" do
    before {visit root_path}
    let(:heading) {'Aroma Scripts'}
    let(:page_title) {''}
    it_should_behave_like "all static pages"
    it { should_not have_title('| 首頁') }
  end
  
  describe "Help page" do
    before {visit help_path}
    let(:heading) {'Help'}
    let(:page_title) {'Help'}
    it_should_behave_like "all static pages"   
  end
    
    
  describe "About page" do
    before {visit about_path}
    let(:heading) {'About Us'}
    let(:page_title) {'About Us'}
    it_should_behave_like "all static pages"   
  end
  
end
