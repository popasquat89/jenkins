'use strict';

var util = require('util');

var _ = require('lodash'),
    socketio = require('socket.io'),
    redis = require('socket.io-redis');

var redisDB = require('./redisconnect');

var _app = null,
    _server = null;

function getServer() {
  return _server;
}

function run(app) {
  if(process.env.NODE_ENV === 'development'){
    process.env.DEBUG = '*';
  }
  _app = app;
  _app.servers.socketio = exports;
  _server = socketio.listen(_app.servers.http.getServer(), {serveClient: false});

  if (!_.isPlainObject(app.config.socketio)) {
    throw new Error('Missing config object: socketio');
  } else if (!_.isString(app.config.socketio.store)) {
    throw new Error('Missing config variable: socketio.store');
  }

  _server.adapter(redis({
    key: app.config.session.store.redis.prefix,
    host: app.config.db.redis.host,
    port: app.config.db.redis.port,
    pubClient: redisDB.createClient(app.config.db.redis),
    subClient: redisDB.createClient(app.config.db.redis),
  }));

  // if (app.config.socketio.store === 'redis') {
  //   _server.set('store', new RedisStore({
  //     redis: redis,
  //     redisPub: redisDB.createClient(app.config.db.redis),
  //     redisSub: redisDB.createClient(app.config.db.redis),
  //     redisClient: redisDB.createClient(app.config.db.redis)
  //   }));
  // }

  // _server.enable('browser client minification');
  // _server.enable('browser client etag');
  // _server.enable('browser client gzip');
  // _server.set('log level', 1);

  console.log('Socket.io Server Running...')
}

// Public API
exports.getServer = getServer;
exports.run = run;