require 'spec_helper'

describe "RecipePages" do
   subject { page }

  describe "profile page" do
    let(:recipe) { FactoryGirl.create(:recipe) }
    before { visit recipe_path(recipe) }

    it { should have_content(recipe.name) }
    it { should have_title(recipe.name) }
  end

  describe "new script page" do
    before { visit newscript_path }

    it { should have_content('New Script') }
    it { should have_title(full_title('New Script')) }
  end
end
