function validate() {
  var devicename = document.getElementById("devicename").value;
  var unitid = document.getElementById("unitid").value;
  var unitidRegex = /^[0-9]*$/;
  var ipaddress = document.getElementById("ipaddress").value;
  var ipaddressRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  if (unitid == "") {
    document.getElementById("unitid_alert").innerHTML = "Please enter a unit id.";
    document.getElementById("unitid_alert").style.color = "Red";
  } else if (!unitidRegex.test(unitid)) {
    document.getElementById("unitid_alert").innerHTML = "Only numeric";
    document.getElementById("unitid_alert").style.color = "Red";
  } else {
    document.getElementById("unitid_alert").innerHTML = "&nbsp;";
  }

  if (ipaddress == "") {
    document.getElementById("ipaddress_alert").innerHTML = "Please enter a ip address.";
    document.getElementById("ipaddress_alert").style.color = "Red";
  } else if (!ipaddressRegex.test(ipaddress)) {
    document.getElementById("ipaddress_alert").innerHTML = "Please enter a ip address.";
    document.getElementById("ipaddress_alert").style.color = "Red";
  } else {
    document.getElementById("ipaddress_alert").innerHTML = "&nbsp;";
  }

  if (devicename == "") {
    document.getElementById("devicename_alert").innerHTML = "Please enter a name.";
    document.getElementById("devicename_alert").style.color = "Red";
  } else {
    document.getElementById("devicename_alert").innerHTML = "&nbsp;";
  }
}
