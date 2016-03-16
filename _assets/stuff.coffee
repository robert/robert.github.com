jQuery ->

  $(window).resize()

  # tracking stuff
  $.each $("a[id]"), (index, ele) ->
    $(ele).click (e) ->
      e.stopImmediatePropagation()
      _gaq.push ["_trackEvent", "Links", "Clicked on " + e.target.id]

  $.each $("[data-time]"), ( index, ele ) ->
    $(ele).html( prettyDate( new Date( $(this).data("time") ) ) )
