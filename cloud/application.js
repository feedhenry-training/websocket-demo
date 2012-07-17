var express = require('express');
var path = require('path');

var app = express.createServer();
var io = require('socket.io').listen(app);
io.set('log level', 1);

var staticPath = path.normalize(__dirname + "/../client/default");
console.log('staticPath=' + staticPath);
app.use(express.static(staticPath));

var shapes = ['circle', 'triangle', 'square'];
var shapeCounter = 0;
var colours = ['#000', '#f33', '#3f3', '#33f', '#ff3', '#3ff', '#f3f', '#f99', '#9f9', '#99f', '#ff9', '#9ff', '#f9f', '#993', '#933', '#393', '#339', '#399', '#999', '#666'];
var colourCounter = 0;

function nextShape() {
  return shapes[(shapeCounter += 1) % shapes.length];
}

function nextColour() {
  return colours[(colourCounter += 1) % colours.length];
}

var users = [];

var updateUserList = function() {
  io.sockets.in('room').emit('userlist', {
    "users": users
  });
};

var userCount = 0;
var users = [];


// Handler new users connecting
io.sockets.on('connection', function(socket) {
  var shape;
  var colour;
  var userObj;

  shape = nextShape();
  colour = nextColour();

  // save user to user list
  userObj = {
    "socketId": socket.id,
    "shape": shape,
    "colour": colour
  };
  users.push(userObj);

  // let user know their info
  socket.emit('user', userObj);

  // join user to room
  socket.join('room');

  // let everyone know update to user list
  updateUserList();

  // Broadcast messages to all clients
  socket.on('message', function(data) {
    var message = {
      "x": data.x,
      "y": data.y,
      "shape": shape,
      "colour": colour
    };
    io.sockets.in('room').emit('message', message);
    //console.log('data=' + JSON.stringify(message));
  });

  // If user disconnects
  socket.on('disconnect', function() {
    // update user list
    users.splice(users.indexOf(userObj), 1);

    // let everyone know update to user list
    updateUserList();

    var message = socket.id + ' disconnected';
    //console.log(message);
  });
});

app.listen(process.env.FH_PORT || 8888);
