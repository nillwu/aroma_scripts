require 'spec_helper'

describe "Static pages" do

  describe "首頁" do
    it "應該要有Aroma Scripts" do
      visit '/static_pages/home'
      expect(page).to have_content('Aroma Scripts')
    end
    it "should have the title '首頁'" do
      visit '/static_pages/home'
      expect(page).to have_title("Aroma Scripts | 首頁")
    end
  end
  
  describe "Help page" do
    it "Help" do
      visit '/static_pages/help'
      expect(page).to have_content('Help')
    end    
  end
    
    
  describe "About page" do
    it "should have the content 'About Us'" do
      visit '/static_pages/about'
      expect(page).to have_content('About Us')
    end
  end
end
