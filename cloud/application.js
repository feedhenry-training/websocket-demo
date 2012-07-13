var io = require('socket.io');

io.sockets.on('connection', function(socket) {
  var username;

  socket.emit('registered', {
    message: 'you are now connected'
  });

  // Broadcast messages to all clients
  socket.on('message', function(data) {
    if (!username) {
      // user is registering
      username = data.message;
      socket.broadcast.emit('message', {
        message: username + ' connected'
      });
      socket.emit('message', {
        message: username + ' connected'
      });
      console.log(username + ' connected');
    } else {
      var message = username + ': ' + data.message;
      socket.broadcast.emit('message', {
        message: message
      });
      socket.emit('message', {
        message: message
      });
      console.log('message=' + message);
    }
  });

  // If user disconnects
  socket.on('disconnect', function() {
    console.log(username + ' disconnected');
  });
});

io.listen(process.env.FH_PORT);