var express = require('express');
var path = require('path');

var app = express.createServer();
var io = require('socket.io').listen(app);

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

io.sockets.on('connection', function(socket) {
  var shape;
  var colour;

  shape = nextShape();
  colour = nextColour();

  socket.join('room');

  // Broadcast messages to all clients
  socket.on('message', function(data) {
    var message = {
      "x": data.x,
      "y": data.y,
      "shape": shape,
      "colour": colour
    };
    io.sockets.in('room').emit('message', message);
    console.log('data=' + JSON.stringify(message));
  });

  // If user disconnects
  socket.on('disconnect', function() {
    var message = socket.id + ' disconnected';
    console.log(message);
  });
});

app.listen(process.env.FH_PORT || 8888);