var url = ($fh.APP_MODE_RELEASE === $fh.legacy.appMode ? $fh.legacy.releaseCloudUrl : $fh.legacy.debugCloudUrl);
var socket = io.connect(url);


socket.on('registered', function (data) {
  // show registered message to user
  $('#info').text(data.message);
  // username is also available as data.user if required
  $('#send').removeAttr('disabled');
});

socket.on('message', function (data) {
  // Update message log with received message
  $('#messages').append(data.message + '<br/>');
});

socket.on('userlist', function (data) {
  // Update userlist with full list of connected users
  $('#users').text('Users(' + data.users.length + '): ' + data.users.join(','));
});

$('#message').keyup(function (e) {
  // 'enter' key shortcut for sending message
  if (e.keyCode === 13) {
    $('#send').trigger('click');
  }
});

$('#send').on('click', function () {
  // send message to server
  socket.emit('message', {
    message: $('#message').val()
  });
  $('#message').val('').focus();
});