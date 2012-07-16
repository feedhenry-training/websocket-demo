var express = require('express');

var app = express.createServer(),
    io = require('socket.io').listen(app);

app.listen(process.env.FH_PORT || 8888);

app.use(express.static(__dirname + '/../client/default'));

var userCount = 0;
var users = [];


// Handler new users connecting
io.sockets.on('connection', function(socket) {

  // new user, generate username and send back registered message
  var username = 'user#' + (userCount += 1);
  users.push(username);
  socket.emit('registered', {
    "message": "Connected as " + username,
    "user": username
  });

  // user joins room
  socket.join('room');

  // update all clients with new userlist
  console.log('users:' + users.join(','));
  io.sockets.in('room').emit('userlist', {
    users: users
  });

  // Handle user sending a message
  socket.on('message', function(data) {
    var message = username + ': ' + data.message;
    // Emit to all clients
    io.sockets.in('room').emit('message', {
      message: message
    });
    console.log('message=' + message);
  });

  // Handle user disconnects
  socket.on('disconnect', function() {
    // remove user from user list
    users.splice(users.indexOf(username), 1);

    // update all clients with new userlist
    console.log('users:' + users.join(','));
    io.sockets.in('room').emit('userlist', {
      users: users
    });
  });
});