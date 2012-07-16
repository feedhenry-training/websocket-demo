var express = require('express');
var path = require('path');

var app = express.createServer();
var io = require('socket.io').listen(app);

var staticPath = path.normalize(__dirname + "/../client/default");
console.log('staticPath=' + staticPath);
app.use(express.static(staticPath));

io.sockets.on('connection', function(socket) {
  // var username;
  socket.join('room');

  // Broadcast messages to all clients
  socket.on('message', function(data) {
    // if (!username) {
    //   socket.join('room');
    //   socket.emit('registered', {
    //     message: 'connected to server'
    //   });

    //   // User is registering.
    //   // Add them to room and emit connected message
    //   // Also send an update to all clients to say this user is connected
    //   username = data.message;
    //   // io.sockets.in('room').emit('message', {
    //   //   message: username + ' connected'
    //   // });
    //   console.log(username + ' connected');
    // } else {
      // User is sending message. Emit to all clients
      io.sockets.in('room').emit('message', data);
      console.log('data=' + JSON.stringify(data));
    // }
  });

  // If user disconnects
  socket.on('disconnect', function() {
    var message = socket.id + ' disconnected';
    // io.sockets.in('room').emit('message', {
    //   message: message
    // });
    console.log(message);
  });
});

app.listen(process.env.FH_PORT || 8888);