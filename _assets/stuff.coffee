jQuery ->

  $(window).resize()

  $.each $("pre"), ( index, code ) ->
    new CodeMirror (node) ->
      code = code.get(0) if code instanceof jQuery
      code.parentNode.replaceChild(node, code)
    ,
      value: $.trim(code.textContent.split("||")[1])
      readOnly: true
      mode: $.trim(code.textContent.split("||")[0])
      theme: "monokai"
      lineNumbers: $.trim(code.textContent.split("||")[1]).match("\\n")
      matchBrackets: true

  # tracking stuff
  $.each $("a[id]"), (index, ele) ->
    $(ele).click (e) ->
      e.stopImmediatePropagation()
      _gaq.push ["_trackEvent", "Clicks on " + e.target.id]

  $.each $("[data-time]"), ( index, ele ) ->
    $(ele).html( prettyDate( new Date( $(this).data("time") ) ) )
