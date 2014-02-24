# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
addSelectItem = (elem) ->
  intId = $("[id^='fieldWrapper']").length + 1
  #alert intId
  #alert elem.id
  
  #add options from db
  aurl = '/aroma_effect'
  $.ajaxSetup({
    async: false
  })
  if aurl
    $.getJSON aurl,  (data) =>
      $.each data, (index, el) =>
        @options +=  "<option value='#{el.id}'>#{el.name}</option>"

  fieldWrapper  = $('<div class=\'row\' id=\'fieldWrapper' + intId + '\'/>')
  fEffectName   = $('<div class=\'span2\'> 藥學屬性' +intId+ ' </div>')
  fType1        = $('<div class=\'span3\'><select class=\'fieldtype\' id=\'recipe_AromaEffect_armoa_effect_id[' + intId + ']\' > ' + @options +  ' </select> </div>')
  #fType1        = $('<div class=\'span3\'><select class=\'fieldtype\' id=\'recipe_AromaEffect_armoa_effect_id' + intId + '\' > ' + @options +  ' </select> </div>')
  findButton    = $('<div class=\'span1\'><button id=\'findButton' + intId + '\' class=\'btn\'><i class=\'icon-search\'></i></button></div>')
  fName1        = $('<div class=\'span2\'> <input id=\'eco' + intId + '\' type=\'text\'  /> </div>')
  fName2        = $('<div class=\'span2\'> <input  type=\'text\'  /> </div>')
  fName3        = $('<div class=\'span2\'> <input  type=\'text\'  /> </div>')
  removeButton  = $('<div class=\'span2\'> <input type=\'button\' class=\'remove\' value=\'-\' /> </div> ')
    
  fieldWrapper.append(fEffectName);
  fieldWrapper.append(fType1);
  fieldWrapper.append(findButton);
  fieldWrapper.append(fName1);
  fieldWrapper.append(fName2);
  fieldWrapper.append(fName3);
  #fieldWrapper.append(removeButton);
  fieldWrapper.append('</div>');
  $('#addDiv').append(fieldWrapper);
  $('#findButton'+intId).on 'click',{name: '#eco'+intId, sourceV: intId} , (e) =>pickEco e
  #$('#findButton'+intId).on 'click',{name: '#findButton'+intId}, (e) =>
  #  alert e.data.name
  #  $(e.data.name).hide()

addSelectBoxx = (eco, sourceV)->
  #alert $(sourceV).val()
  sid = $('#recipe_AromaEffect_armoa_effect_id\\['+sourceV+'\\] option:selected').val()
  #alert sid
  url =  "/"+ sid.toString() + "/ecos"
  #alert "url = " + url
  if url
    $.getJSON url, (data) =>
      $.each data, (index, el) =>
        #alert el.name
        $("#dialog").append "<label for='#{el.eco.name}'><input type='radio' id='#{el.eco.name}' value='#{el.eco.name}' name='question'> #{el.elevel}*-- #{el.eco.name} </label> <br>"
        # reinitialize target select
        $( "#dialog" ).trigger("change")
  else
    $( "#dialog" ).trigger("change")

  dialogOpts = {modal: true, buttons: {"Done": getResponse,"Cancel": cancel}, autoOpen: false};
  $( "#dialog" ).data("targetID", eco).dialog(dialogOpts).dialog( "open" );

getResponse = ->
  #alert "getResponse"
  targetID  = $(this).data("targetID")
  answer    = ''
  $("input").each ->
    if (this.checked == true)
      answer = $(this).val()
      
  #$("#recipe_ml").val(answer);
  $(targetID).val(answer)
  $("#dialog").dialog("close")

cancel = ->
  $("#dialog").dialog("close");

pickEco = (e) =>
  #alert e.data.name
  #$(e.data.name).hide()
  initDiv($("#dialog"))
  addSelectBoxx(e.data.name, e.data.sourceV)

initDiv= ($select) ->  
  $select.html('')
$ ->
  $('#addoils').on 'click', (e) ->addSelectItem e.target
