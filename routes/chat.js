var $http = require('../base/http')
const API = require('../config/host')
const DBConfig = require('../config/db')
const mysql = require('mysql')
const connection = mysql.createConnection(DBConfig.db)

module.exports = function (io) {
  var app = require("express");
  var router = app.Router();
  router.get("/:id", (req, res) => {
    io.of("/" + req.params.id)
      .on("connection", client => {
        var onlineUsers = {};
        var onlineCount = 0;
        client.on("login", user => {
          client.name = user.id;
          if (!onlineUsers.hasOwnProperty(user.id)) {
            var num = Math.ceil(Math.random() * 70) | 0;
            onlineUsers[user.id] = {
              name: user.name,
              src: "../img/" + num + ".jpg"
            };
            onlineCount++;
          }
          client.broadcast.emit("welcome", user);
          console.log(user.name + " 加入聊天室");
        });

        client.on("newMsg", data => {
          // 匹配找单关键字，请求找单
          if (/^找[^.]{1,}/i.test(data.info)) {
            $http.post(API.getOrder + 46010194, {
              keyword: data.info.slice(1)
            }).then(res => {
              res = JSON.parse(res)
              if (res.code === 200) {
                res.img = res.data.image_url
                res.cms_url = res.data.cms_url
                res.info = res.data.content.replace(/\n/ig, '<br>')
              } else {
                res.info = '无法找到相关商品，换个关键词再试试吧~'
              }
              res.src = "../img/me.jpg"
              res.id = 10000;
              res.name = '发单机器人'
              res.time = data.time
              client.broadcast.emit('serverMsg', res)
              client.emit('serverMsg', res)
            }).catch(err => {
              console.log('err', err)
            })
          }
          data.src = onlineUsers[data.id]["src"];
          client.emit("serverMsg", data);
          client.broadcast.emit("serverMsg", data);
        });

        client.on("disconnect", function () {
          if (onlineUsers.hasOwnProperty(client.name)) {
            var msg = onlineUsers[client.name];
            delete onlineUsers[client.name];
            onlineCount--;
            msg.count = onlineCount;
            client.broadcast.emit("logout", msg);
            console.log(msg.name + " 离开聊天室");
          }
        });
      });
    res.render("chatroom", {
      roomId: req.params.id
    });
  });
  return router;
};
