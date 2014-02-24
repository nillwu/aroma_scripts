class RecipesController < ApplicationController
  def new
     @recipe = Recipe.new
     @oil = Oil.new
     @baseoils = Baseoil.all
     @effect_ecos = EffectEco.all
     @aroma_effects = AromaEffect.all
     @ecos = Eco.all
  end
  def show
    @recipe = Recipe.find(params[:id])
  end
  
  def create
    @todo_item = TodoItem.create(params[:todo_item])
  end
end
