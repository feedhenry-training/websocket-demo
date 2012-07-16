var url = ($fh.APP_MODE_RELEASE === $fh.legacy.appMode ? $fh.legacy.releaseCloudUrl : $fh.legacy.debugCloudUrl);

var socket = io.connect(url);

socket.on('registered', function (data) {
  x$('#info').html(data.message);
});

// broadcast reception
var counter = 0;
socket.on('message', function (data) {
  var id = (counter += 1);
  //console.log('id=' + id);
  x$('body').top('<div id="' + id + '" class="' + data.shape + '"></div>');
  var idDiv = x$('#' + id);
  //console.log('added div');
  var css = {
    "left":  data.x + 'px',
    "top": data.y + 'px'
  };
  if ('triangle' === data.shape) {
    css['border-bottom-color'] = data.colour;
  } else {
    css['background-color'] = data.colour;
  }
  idDiv.css(css);
  //console.log('updated css');
  //idDiv.addClass('animate');
  setTimeout(function () {
    //console.log('adding animate class');
    idDiv.addClass('animate');
    setTimeout(function () {
      //console.log('removing');
      idDiv.remove();
    }, 500);
  }, 10);
});

function sendEvent(x, y) {
  //console.log('touched@' + x + ',' + y);
  socket.emit('message', {
    "x": x - 10,
    "y": y - 10
  });
}

function isTouchDevice() {
   var el = document.createElement('div');
   el.setAttribute('ongesturestart', 'return;');
   var gestureType = typeof el.ongesturestart;
   if('function' === gestureType) {
      return true;
   }
   return false;
}

var touchEvent = isTouchDevice() ? 'touchstart' : 'click';

x$('body').on(touchEvent, function (e) {
  var x,y;

  if ('undefined' !== typeof e.touches) {
    x = e.touches[0].pageX;
    y = e.touches[0].pageY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }

  sendEvent(x, y);
});