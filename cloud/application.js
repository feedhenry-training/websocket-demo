var express = require('express');

var app = express.createServer(),
    io = require('socket.io').listen(app);

app.listen(process.env.FH_PORT || 8888);

app.use(express.static(__dirname + '/../client/default'));

io.sockets.on('connection', function(socket) {
  var username;

  // Broadcast messages to all clients
  socket.on('message', function(data) {
    if (!username) {
      socket.join('room');
      socket.emit('registered', {
        message: 'you are now connected'
      });

      // User is registering.
      // Add them to room and emit connected message
      // Also send an update to all clients to say this user is connected
      username = data.message;
      io.sockets.in('room').emit('message', {
        message: username + ' connected'
      });
      console.log(username + ' connected');
    } else {
      // User is sending message. Emit to all clients
      var message = username + ': ' + data.message;
      io.sockets.in('room').emit('message', {
        message: message
      });
      console.log('message=' + message);
    }
  });

  // If user disconnects
  socket.on('disconnect', function() {
    var message = username + ' disconnected';
    io.sockets.in('room').emit('message', {
      message: message
    });
    console.log(message);
  });
});