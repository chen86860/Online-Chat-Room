const app = require("express");
const router = app.Router();

const $http = require('../base/http')
const dbHandler = require('../base/mysql')
const API = require('../config/api')
const CONFIG = require('../config/conf')
let socketArr = []
let socketObj = {}
let noop = () => { }

module.exports = function (io) {
  router.get("/:id", (req, res) => {
    if (req.cookies.username) {
      if (!socketArr.includes(req.params.id)) {
        createSocket(req.params.id)
      }
      res.render("chat", {
        roomId: req.params.id
      });
    } else {
      res.redirect('/')
    }
  });
  // 根据id创建聊天群
  let createSocket = (id) => {
    socketArr.push(id)
    socketObj[id] = {
      onlineUsers: {},
      onlineCount: 0
    }
    io.on("connection", client => {
      client.on("login", user => {
        client.uid = user.id;
        user.name = user.name
        if (socketObj[id] && socketObj[id].onlineUsers && !socketObj[id].onlineUsers.hasOwnProperty(client.uid)) {
          console.log('reg', user)
          var num = Math.ceil(Math.random() * 70) || 0;
          socketObj[id].onlineUsers[client.uid] = {
            name: user.name,
            src: "../img/" + num + ".jpg"
          };
          console.log(socketObj[id].onlineUsers)
        }
        client.broadcast.emit("welcome", user);
        // client.broadcast.emit('updateCount', ++socketObj[id].onlineCount)
        console.log(user.name + " 加入聊天室")
      });
      client.on("newMsg", data => {
        data.name = socketObj[id].onlineUsers[data.id]["name"]
        data.src = socketObj[id].onlineUsers[data.id]["src"]
        client.emit("serverMsg", data);
        client.broadcast.emit("serverMsg", data);

        // // 保存发单关键词或聊天记录
        $http.post(API.savePost + 46010194, {
          user_id: data.id,
          nickname: data.username,
          head_portrait: '',
          content: data.info,
          content_type: data.type || 1
        }).then(() => {
          console.log('OK')
        }).catch(() => {
          console.log('bad')
        })

        // 匹配找单关键字，请求找单
        if (/^找[^.]{1,}/i.test(data.info)) {
          $http.post(API.getOrder + 46010194, {
            keyword: data.info.slice(1).replace(/\n/, '')
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
            res.time = data.time || new Date()
            client.broadcast.emit('serverMsg', res)
            client.emit('serverMsg', res)

            //保存正常发单记录
            $http.post(API.savePost + 46010194, {
              user_id: res.id,
              nickname: res.name,
              head_portrait: '',
              content: res.info,
              content_type: 1
            }).then(() => {
              console.log('OK')
            })
            //保存找单图片
            if (res.img) {
              $http.post(API.savePost + 46010194, {
                user_id: res.id,
                nickname: res.name,
                head_portrait: '',
                content: res.img,
                content_type: 2
              }).then(() => {
                console.log('OK')
              }).catch((err) => {
                console.log(err)
              })
            }
          }).catch(err => {
            console.log('err in get order', err)
          })
        }

      });

      client.on("disconnect", function () {
        let disconnect = true
        setTimeout(() => {
          if (disconnect && socketObj[id].onlineUsers.hasOwnProperty(client.uid)) {
            client.disconnect()
            var msg = socketObj[id].onlineUsers[client.uid];
            delete socketObj[id].onlineUsers[client.uid];
            client.broadcast.emit('updateCount', socketObj[id].onlineCount)
            if (--socketObj[id].onlineCount === 0) {
              delete socketObj[id]
            }
            client.broadcast.emit("logout", msg);
            console.log(msg.name + " 离开聊天室");
          }
        }, 0)
      });

      // 定时发单
      if ((CONFIG.TIME_START_TIME - 1) < new Date().getHours() && new Date().getHours() < CONFIG.TIME_END_TIME) {
        let send = setInterval(() => {
          $http.get(API.postOrder + '45903081').then((res) => {
            res = JSON.parse(res)
            if (res.code === 200) {
              res.img = res.data.image_url
              res.cms_url = res.data.cms_url
              res.info = res.data.content.replace(/(http.*)/ig, '<a class="link" href="$1">$1</a>').replace(/\n/ig, '<br>')
            } else {
              clearInterval(send)
              res.info = '发单结束'
            }
            res.src = "../img/me.jpg"
            res.id = 10000;
            res.name = '发单机器人'
            res.time = new Date()
            client.broadcast.emit('serverMsg', res)
            client.emit('serverMsg', res)
          }).catch((err) => {
            console.log('[', new Date(), ']', '定时发单失败,err', err)
          })
        }, CONFIG.TIME_INTERVAL)
      }
    });
  }
  // 后台登录
  router.get('/login', (req, res) => {
    res.render('login')
  })

  // 管理界面
  router.get('/admin', (req, res) => {
    res.render('admin', {
      socketArr: socketArr
    })
  })

  return router;
};
