$('#register').on('submit', function (e) {
  e.preventDefault();

  var name = $('#name');
  var username = $('#username');
  var password = $('#password');
  var email = $('#email');
  var retypePw = $('#retypePw');
  var valid = false;

  var fields = [name, email, username, password, retypePw];
  for (var i = 0; i < fields.length; i++) {  // Loop through the fields and remove the red outline if there is one
    fields[i].removeClass('is-danger');
  }

  // Loop through fields to see if they are filled.
  for (var i = 0; i < fields.length; i++) {
    if (fields[i][0].value === '') {
      var id = fields[i][0].id;
      if (id === 'retypePw') {
        failureAlert('Please confirm your password.');
      } else {

        failureAlert('Please fill out your ' + id);
      }
      fields[i].addClass('is-danger');
      break;
    }
    if (i === 4) {   // If they are all filled out, check to see if passwords match
      if (fields[3][0].value != fields[4][0].value) {
        failureAlert('Your passwords do not match');
        fields[3].addClass('is-danger');
        fields[4].addClass('is-danger');
        break;
      }
      valid = true; // If passwords match, send the data over to the sever.
    }
  }

  if (valid === true) {
    var values = {};    // Stores the values of the input fields
    $.each($('#register').serializeArray(), function (i, field) {   // Loops through the input fields
      values[field.name] = field.value;
    });
    delete values.retypePw; //delete the confirmed password

    values.application = 'Clotho Web'; // add application name
    // If user does not already exist, send to home page
    // If any error, show it in an alert
    $.post('../../api/signup', values, function () {
      window.location.replace('/');
    }).fail(function (data) {
      failureAlert(data.responseJSON.message)
    });
  }
});

var emailFocus = false;
var usernameFocus = false;
$('#email').focus(function (e) {
  e.preventDefault();
  emailFocus = true;
});
$('#username').focus(function (e) {
  e.preventDefault();
  usernameFocus = true;
});

// Email verification
$('#email').blur(function (e) {
  if (emailFocus === true) {
    //e.preventDefault();
    emailFocus = false;
    $.post('/api/available', {email: $('#email')[0].value}, function (data) {
      var message = data.email.message;
      var success = 'This email is available';

      if (message === success) {
        $('#email').removeClass('is-danger').addClass('is-success');
        $('#emailRightIcon').removeClass('fa-warning').addClass('fa-check');
        $('#emailCheck').css('display', '');
        $('#emailStatus').text(success);
      }
      else {
        $('#email').removeClass('is-success').addClass('is-danger');
        $('#emailRightIcon').removeClass('fa-check').addClass('fa-warning');
        $('#emailCheck').css('display', '');
        $('#emailStatus').text(message);
      }
    }).fail(function (data) { // It will fail if the input is not in email form
      var message = formatResponseMessage(data.responseJSON.message);
      $('#email').removeClass('is-success').addClass('is-danger');
      $('#emailRightIcon').removeClass('fa-check').addClass('fa-warning');
      $('#emailCheck').css('display', '');
      $('#emailStatus').text(message);
    });
  }
});

// Username verifiation
$('#username').blur(function () {
  if (usernameFocus === true) {
    //e.preventDefault();
    usernameFocus = false;
    $.post('/api/available', {username: $('#username')[0].value}, function (data) {
      var message = data.username.message;
      var success = 'This username is available';

      if (message === success) {
        $('#username').removeClass('is-danger').addClass('is-success');
        $('#usernameRightIcon').removeClass('fa-warning').addClass('fa-check');
        $('#usernameCheck').css('display', '');
        $('#usernameStatus').text(success);
      } else {
        $('#username').removeClass('is-success').addClass('is-danger');
        $('#usernameRightIcon').removeClass('fa-check').addClass('fa-warning');
        $('#usernameCheck').css('display', '');
        $('#usernameStatus').text(message);
      }
    }).fail(function (data) {   // It will fail if the input is not in email form
      var message = formatResponseMessage(data.responseJSON.message);
      $('#username').removeClass('is-success').addClass('is-danger');
      $('#usernameRightIcon').removeClass('fa-check').addClass('fa-warning');
      $('#usernameCheck').css('display', '');
      $('#usernameStatus').text(message);
    });
  }
});

// Password verification
$('#retypePw').keyup(function (e) {
  e.preventDefault();
  var pw = $('#password')[0].value;
  var pw2 = $('#retypePw')[0].value;
  if (pw === '') {
    $('#retypePwStatus').text('Please type in a password');
  } else if (pw === pw2) {
    $('#retypePw').removeClass('is-danger').addClass('is-success');
    $('#retypePwRightIcon').removeClass('fa-warning').addClass('fa-check');
    $('#retypePwCheck').css('display', '');
    $('#retypePwStatus').text('Passwords match!');
  } else {
    $('#retypePw').removeClass('is-success').addClass('is-danger');
    $('#retypePwRightIcon').removeClass('fa-check').addClass('fa-warning');
    $('#retypePwCheck').css('display', '');
    $('#retypePwStatus').text('Passwords do not match');
  }
});

$('#password').keyup(function (e) {
  var password = vaildPassword($('#password').val());
  if(password !== true) {
    $('#password').removeClass('is-success').addClass('is-danger');
    $('#passwordRightIcon').removeClass('fa-check').addClass('fa-warning');
    $('#passwordCheck').css('display', '');
  } else {
    $('#password').removeClass('is-danger').addClass('is-success');
    $('#passwordRightIcon').removeClass('fa-warning').addClass('fa-check');
    $('#passwordCheck').css('display', '');
  }
});

function formatResponseMessage(message) {
  if (message.lastIndexOf('[') != -1) {
    message = message.substring(message.lastIndexOf('[') + 1, message.lastIndexOf(']')).replace(/\"/g, "");
  }
  return message;
}

function vaildPassword(password) {
  if (!(password.length >= 8)) {
    return "Password must be 8 characters long";
  }

  if (!(password.length <= 32)) {
    return "Password can not exceed 32 characters in length";
  }

  if (!((password.match(/[a-z]/g) || []).length >= 1)) {
    return "Password must contain at least 1 lowercase letter";
  }

  if (!((password.match(/[A-Z]/g) || []).length >= 1)) {
    return "Password must contain at least 1 uppercase letter";
  }

  if (!((password.match(/[0-9]/g) || []).length >= 1)) {
    return "Password must contain at least 1 number";
  }

  return true;
}
