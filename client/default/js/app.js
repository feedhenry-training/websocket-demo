var url = ($fh.APP_MODE_RELEASE === $fh.legacy.appMode ? $fh.legacy.releaseCloudUrl : $fh.legacy.debugCloudUrl);

var socket = io.connect(url);

socket.on('registered', function (data) {
  x$('#info').html(data.message);
});

// broadcast reception
var counter = 0;
var shapes = ['circle', 'triangle', 'square'];
socket.on('message', function (data) {
  var id = (counter += 1);
  console.log('id=' + id);
  x$('body').top('<div id="' + id + '" class="' + shapes[(id%shapes.length)] + '"></div>');
  var idDiv = x$('#' + id);
  console.log('added div');
  idDiv.css({
    "left":  data.x + 'px',
    "top": data.y + 'px'
  });
  console.log('updated css');
  //idDiv.addClass('animate');
  setTimeout(function () {
    console.log('adding animate class');
    idDiv.addClass('animate');
    setTimeout(function () {
      console.log('removing');
      idDiv.remove();
    }, 500);
  }, 10);
});

x$('body').on('touchend', function (e) {
  console.log('touched');
  for (var key in e) {
    console.log('e.' + key + '=' + e[key]);
  }
  console.log('e.changedTouches=' + JSON.stringify(e.changedTouches));
  console.log('e.touches=' + JSON.stringify(e.touches));
  console.log('e.targetTouches=' + JSON.stringify(e.targetTouches));
  socket.emit('message', {
    "x": (e.clientX - 10),
    "y": (e.clientY - 10)
  });
});