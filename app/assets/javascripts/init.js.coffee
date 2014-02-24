window.initApp = ->
  $('select[data-dynamic-selectable-url]').dynamicSelectable()
  #$('#addoils').addSelectItem()

document.addEventListener 'page:load', initApp

$ initApp
