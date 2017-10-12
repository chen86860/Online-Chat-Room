 var io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });

  // sending to all clients
  // io.emit('broadcast', /* ... */);

  // sending to all clients in 'game' room
  // io.to('game').emit('new-game', /* ... */);

  // sending to individual socketid (private message)
  // io.to(<socketid>).emit('private', /* ... */);

  var nsp = io.of('/admin');

  // sending to all clients in 'admin' namespace
  nsp.emit('namespace', /* ... */);

  // sending to all clients in 'admin' namespace and in 'notifications' room
  nsp.to('notifications').emit('namespace', /* ... */);