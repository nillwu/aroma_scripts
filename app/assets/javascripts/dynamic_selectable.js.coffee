$.fn.extend
  dynamicSelectable: ->
    $(@).each (i, el) ->
      new DynamicSelectable($(el))
###      
$.fn.extend
  addSelectItem: ->
    $(@).each (i, el) ->
      new AddSelectItem($(el))
###

class DynamicSelectable

  constructor: ($select) ->
    @init($select)

  init: ($select) ->
    @urlTemplate = $select.data('dynamicSelectableUrl')
    @$targetSelect = $($select.data('dynamicSelectableTarget'))
    
    $select.on 'change', =>
      alert $select.attr("id")
      alert "@urlTemplate = " + @urlTemplate
      alert @$targetSelect.attr("id")
      @clearTarget()
      url = @constructUrl($select.val())
      alert "url = " + url
      if url
        $.getJSON url, (data) =>
          $.each data, (index, el) =>
            @$targetSelect.append "<option value='#{el.id}'>#{el.name}</option>"
            # reinitialize target select
            
          @reinitializeTarget()
      else
        @reinitializeTarget()

  reinitializeTarget: ->
    @$targetSelect.trigger("change")

  clearTarget: ->
    @$targetSelect.html('<option></option>')

  constructUrl: (id) ->
    if id && id != ''
      @urlTemplate.replace(/:.+_id/, id)
      


class AddSelectItem

  constructor: ($select) ->
    @init($select)

  init: ($select) ->
    @urlTemplate = $select.data('dynamicSelectableUrl9999')
    @$targetSelect = $($select.data('dynamicSelectableTarget111'))
    $select.on 'click', =>
      @addSelectBox()
      $( "#dialog" ).dialog({ autoOpen: false })
      $( "#dialog" ).dialog("option", "title", "Loading...").dialog( "open" );
      
      
      url = @constructUrl($select.val())
      if url
        $.getJSON url, (data) =>
          $.each data, (index, el) =>
            @$targetSelect.append "<option value='#{el.id}'>#{el.name}</option>"
            # reinitialize target select
          @reinitializeTarget()
      else
        @reinitializeTarget()

  reinitializeTarget: ->
    @$targetSelect.trigger("change")

  clearTarget: ->
    @$targetSelect.html('<option></option>')

  addSelectBox: ->
    intId = $("[id^='fieldWrapper']").length + 1
    #intId = $('#addDiv div').length + 1
    alert intId
    
    #add options from db
    aurl = '/aroma_effect'
    $.ajaxSetup({
      async: false
    })
    if aurl
      $.getJSON aurl,  (data) =>
        $.each data, (index, el) =>
          @options +=  "<option value='#{el.id}'>#{el.name}</option>"
          
    fieldWrapper = $('<div class=\'row\' id=\'fieldWrapper' + intId + '\'/>')
    fEffectName = $('<div class=\'span2\'> 藥學屬性' +intId+ ' </div>')
    fType1 = $('<div class=\'span3\'><select class=\'fieldtype\' id=\'recipe_AromaEffect_armoa_effect_id[' + intId + ']\' > ' + @options +  ' </select> </div>')
    fType2 = $('<div class=\'span3\'><select class=\'fieldtype\' id=\'recipe_AromaEffect_armoa_effect_id[' + intId + ']\' ><option value=\'checkbox\'>Checked</option><option value=\'textbox\'>Text</option><option value=\'textarea\'>Paragraph</option></select> </div>')
    fName1 = $('<div class=\'span2\'> <input  type=\'text\'  /> </div>')
    fName2 = $('<div class=\'span2\'> <input  type=\'text\'  /> </div>') 
    removeButton = $('<div class=\'span2\'> <input type=\'button\' class=\'remove\' value=\'-\' /> </div> ')
  
   
   
   
    
    fieldWrapper.append(fEffectName);
    fieldWrapper.append(fType1);
    fieldWrapper.append(fType2);
    fieldWrapper.append(fName1);
    fieldWrapper.append(fName2);
    #fieldWrapper.append(removeButton);
    fieldWrapper.append('</div>');
    $('#addDiv').append(fieldWrapper);
    
   

  constructUrl: (id) ->
    if id && id != ''
      @urlTemplate.replace(/:.+_id/, id)

