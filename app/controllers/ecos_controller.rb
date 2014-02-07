class EcosController < ApplicationController
  respond_to :json
  def index
    @ecos = Eco.joins(:aroma_effects, :effect_ecos).where('effect_ecos.aroma_effect_id = ?' , params[:aroma_effect_id]).distinct
    
    logger.debug "New ecos: #{@ecos.inspect}"
    respond_with(@ecos)
  end
end
