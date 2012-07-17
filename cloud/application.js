var express = require('express');
var path = require('path');

var app = express.createServer();
var io = require('socket.io').listen(app);
io.set('log level', 1);

var staticPath = path.normalize(__dirname + "/../client/default");
console.log('staticPath=' + staticPath);
app.use(express['static'](staticPath));

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
  io.sockets['in']('room').emit('userlist', {
    users: users
  });

  // Handle user sending a message
  socket.on('message', function(data) {
    var message = username + ': ' + data.message;
    // Emit to all clients
    io.sockets['in']('room').emit('message', {
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
    io.sockets['in']('room').emit('userlist', {
      users: users
    });
  });
});

app.listen(process.env.FH_PORT || 8888);