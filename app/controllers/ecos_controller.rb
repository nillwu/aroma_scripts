class EcosController < ApplicationController
  #respond_to :json (:include=> :effect_ecos)
  def index
  	logger.debug "yyyyyyyyyyyyyy"
    #@ecos = Eco.joins(:aroma_effects, :effect_ecos).where('effect_ecos.aroma_effect_id = ?' , params[:aroma_effect_id]).distinct
    @effect_ecos = EffectEco.joins(:aroma_effect, :eco).where('effect_ecos.aroma_effect_id = ?' , params[:aroma_effect_id]).distinct
    #logger.debug "New ecos: #{@ecos.inspect}"
    #respond_with(@ecos)
    respond_to do |format|
      format.json do
        #render :json => @ecos.to_json(:include => { :effect_ecos => { :only => :elevel } })
        #render :json => @effect_ecos.to_json(:include => { :ecos })
        render :json => @effect_ecos.to_json(:include => { :eco => { :only => :name } })
      end
    end
  end
end
