$("#resultCheckbox").click(function() {
  var checked_status = this.checked;
  if (checked_status == true) {
    $("#nexpie_submit").removeAttr("disabled");
    $("#resultClientID").removeAttr("disabled");
    $("#resultToken").removeAttr("disabled");
    $("#resultSecret").removeAttr("disabled");
  } else {
    $("#nexpie_submit").attr("disabled", "disabled");
    $("#resultClientID").attr("disabled", "disabled");
    $("#resultToken").attr("disabled", "disabled");
    $("#resultSecret").attr("disabled", "disabled");
  }
});
