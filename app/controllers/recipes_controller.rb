class RecipesController < ApplicationController
  def new
      @recipe = Recipe.new
     @baseoils = Baseoil.all
  end
  def show
    @recipe = Recipe.find(params[:id])
  end
end
