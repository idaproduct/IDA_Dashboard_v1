$('#password, #repassword').on('keyup', function() {
  if ($('#password').val() == $('#repassword').val() && $('#password').val() != "" && $('#repassword').val() != "") {
    $('#message').html("Password OK").css('background-color', 'green');
  } else if ($('#password').val() == "" && $('#repassword').val() == "") {
    $('#message').html("Password cannot be blank").css('background-color', 'red');
  } else
    $('#message').html("Password doesn't match").css('background-color', 'red');
});
