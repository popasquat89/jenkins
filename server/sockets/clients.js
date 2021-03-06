var app = require('../app'),
    co = require('co'),
    _ = require('lodash');

//Wrap the try/catch on the event.
function wrapEvent(fn, data, socket, emitEvent) {
  co(function *() {
    try {
      var obj = yield fn(data);
    } catch (e) {
      console.log(e);
      socket.emit('error', e);
    }

    if(socket && emitEvent) {
      socket.emit(emitEvent, obj);
    }
  })();
}

/*
  Register the socket to receive and emit events to connected clients
  from the website/phone application.

  Received Events:
  client:system:state:{put, get}


  Emitted Events:
  client:system:state:{status}

 */
exports.impl = {};
exports.impl.register = function (socket) {
  socket.on('client:system:component:put', function (data, cb) {
    wrapEvent(app.controllers.systems.impl.systemComponentPUT, data, socket, 'client:system:state:status');
  });

  socket.on('client:system:state:get', function (data, cb) {
    wrapEvent(app.controllers.systems.impl.systemStateGET, data, socket, 'client:system:state:status');
  });
};