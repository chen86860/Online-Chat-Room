#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('Blog:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//online user
//var onlineUsers=();
//online user count
//var onlineCoount= 0;

var userList = {};
var userConut = 0;

var io = require('socket.io').listen(server);
io.on('connect', function (socket) {

    console.log('a new user connect');
    var socketID = socket.id;

    socket.on('login', function (obj) {
        socket.name = obj.username;

        if (!userList.hasOwnProperty(socketID)) {
            userList[socketID] = obj.username;
        }

        // 1进入
        io.emit('users', {userList: userList, newuser: obj.username, flag: '1'});
        console.log(userList);
    });

    // console.log(socket.name);
    //socket监听用户事件
    // socket.on('event listening',callback)
    socket.on('disconnect', function () {
        var name = userList[socketID];
        delete userList[socketID];
        // 1进入
        io.emit('users', {userList: userList, newuser: name, flag: '0'});

        console.log('user disconnect');
    });

    //socket.emit,发送用户消息
    //socket is a sinlge info
    //io.emit is a global info
    socket.on('chat message', function (msg) {
        console.log(msg);
        if (msg.to == 'all') {
            io.emit('chatBack', msg)
        } else {
            // io.sockets.connected[socketid].emit();
            for (var key in userList) {
                console.log(key + ":" + userList[key]);
                if (userList[key] == msg.to) {
                    socket.to(key).emit('chatBack', msg);
                }
                if (userList[key] == msg.username) {
                    socket.to(key).emit('chatBack', msg);
                }

            }
        }
    });
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
