var url = ($fh.app_props.mode === "dev" ? $fh.cloud_props.hosts.debugCloudUrl : $fh.cloud_props.hosts.releaseCloudUrl);
document.getElementById('serverurl').innerHTML = 'Server URL: ' + url;
var socket = io.connect(url);


// Handle when server acknowledges user's registration/connection
socket.on('registered', function (data) {
  // show registered message to user
  $('#info').text(data.message);
  // username is also available as data.user if required
  $('#send').removeAttr('disabled');
});

// Handle new messages from any user (including self)
socket.on('message', function (data) {
  // Update message log with received message
  $('#messages').append(data.message + '<br/>');
});

// Handle updated user list
socket.on('userlist', function (data) {
  // Update userlist with full list of connected users
  $('#users').text('Users(' + data.users.length + '): ' + data.users.join(','));
});

// click/touch handler for sending message
$('#send').on('click', function () {
  // send message to server
  socket.emit('message', {
    message: $('#message').val()
  });
  // refocus to an empty input field
  $('#message').val('').focus();
});

// 'enter' key shortcut for sending message
$('#message').keyup(function (e) {
  if (e.keyCode === 13) {
    $('#send').trigger('click');
  }
});