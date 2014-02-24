class AromaEffectsController < ApplicationController
  respond_to :json
  def index
    logger.debug "9999-"
    @aroma_effects = AromaEffect.all
    logger.debug "New aroma_effects: #{@aroma_effects.inspect}"
    respond_with(@aroma_effects)
  end
end
