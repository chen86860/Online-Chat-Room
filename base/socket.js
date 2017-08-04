module.exports = function (io) {
  
  var onlineUsers = {};
  var onlineCount = 0;
  // 设置监听
  io.of('/channel1')
    .on('connection', function (client) {
      client.on('login', (user) => {
        client.name = user.id;
        if (!onlineUsers.hasOwnProperty(user.id)) {
          var num = Math.ceil(Math.random() * 70) | 0
          onlineUsers[user.id] = {
            name: user.name,
            src: "img/" + num + '.jpg'
          }
          onlineCount++;
        };
        client.broadcast.emit('welcome', user);
        console.log(user.name + ' 加入聊天室');
      });

      client.on('newMsg', (data) => {
        // var regx = /找.*?/.test(data)
        // if(regx){

        // }
        data.src = onlineUsers[data.id]['src']
        client.emit('serverMsg', data);
        client.broadcast.emit('serverMsg', data);
      });

      client.on('disconnect', function () {
        if (onlineUsers.hasOwnProperty(client.name)) {
          var msg = onlineUsers[client.name]
          delete onlineUsers[client.name];
          onlineCount--;
          msg.count = onlineCount;
          client.broadcast.emit('logout', msg)
          console.log(msg.name + ' 离开聊天室')
        };
      });
    });
}