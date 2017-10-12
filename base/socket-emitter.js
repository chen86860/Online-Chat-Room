var Redis = require("ioredis");
var redis = new Redis();
var io = require('socket.io-emitter')(redis);

// Make the emitter works with redis clustered environment.
var Cluster = new Redis.Cluster([
  {
    host: "localhost",
    port: 6379
  },
  {
    host: "localhost",
    port: 6378
  },
]);
var io = require('socket.io-emitter')(Cluster);