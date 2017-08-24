const app = require("express");
const router = app.Router();

const $http = require('../base/http')
const dbHandler = require('../base/mysql')
const API = require('../config/api')
const CONFIG = require('../config/conf')
const log = require('../base/log').log

let noop = () => { }

var Room = function () {
  var o = {
    room: {},
    timer: [],
  }

  o.add = function (gid, id, client) {
    if (Object.prototype.toString.apply(o.room[gid]) !== '[object Array]') {
      o.room[gid] = []
    }
    o.room[gid].push({
      id: id,
      client: client,
    })

  }
  o.del = function (gid, id) {
    let index = o.room[gid].findIndex(e => e.id === id)
    o.room[gid].splice(index, 1)
  }
  o.existed = function (gid) {
    return !!(o.room[gid])
  }
  o.add_timer = function (gid) {
    o.timer.push(gid)
  }
  o.timed = function (gid) {
    return o.timer.includes(gid)
  }

  return o
}
var room = Room()

module.exports = function (io) {
  router.get("/history/:group/:page/:size", (req, res) => {
    if (req.params.page && req.params.size) {
      $http.get(API.getPost + req.params.group, {
        page: req.params.page,
        size: req.params.size
      }).then(resu => {
        resu = JSON.parse(resu)
        res.json(resu)
      }).catch(err => {
        res.json({
          code: 206,
          data: err
        })
      })
    } else {
      res.json({
        code: 207,
        data: 'params is not fixed'
      })
    }
  })

  router.get("/room", (req, res) => {
    if (req.query.group_id) {
      var gid = req.query.group_id
      if ((!room.existed(gid))) {
        createRoom(gid)
      }
      res.render("chat", {
        group_id: gid,
        user_id: req.query.user_id || 'y' + Math.ceil(Math.random() * 10000),
        nickname: req.query.nickname || '游客' + Math.ceil(Math.random() * 10000),
        avatar: req.query.avatar || '/chat/static/img/user.png'
      })
    } else {
      res.render('error', {
        message: '链接不合法，请稍后重试'
      })
    }
  })

  // 根据id创建聊天群
  let createRoom = (gid) => {
    io.of('/' + gid)
      .on("connection", client => {
        client.on("login", user => {
          client.uid = user.id;
          client.uname = user.name;
          room.add(gid, user.id, client)
          log('info', user.name + ' 加入聊天室')
        });
        client.on("newMsg", data => {
          client.emit("serverMsg", data);
          client.broadcast.emit("serverMsg", data);

          // 不保存游客聊天记录
          if (!/^y.*?/.test(data.id)) {
            // 保存发单关键词或聊天记录
            $http.post(API.savePost + gid, {
              user_id: data.id,
              nickname: data.name,
              head_portrait: data.src,
              content: data.info,
              content_type: data.type || 1,
              send_time: data.time
            }).then(() => {
              log('聊天记录_[USER]', JSON.stringify({
                user_id: data.id,
                nickname: data.name,
                head_portrait: data.src,
                content: data.info,
                content_type: data.type || 1,
                send_time: data.time
              }))
            }).catch(() => {
              log('聊天记录BAD', '')
            })
          }

          // 匹配找单关键字，请求找单
          if (/^找[^.]{1,}/i.test(data.info)) {
            $http.post(API.getOrder + gid, {
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
              res.src = "/chat/static/img/me.jpg"
              res.id = 10000;
              res.name = '发单机器人'
              client.broadcast.emit('serverMsg', res)
              client.emit('serverMsg', res)

              //保存找单图片
              if (res.img) {
                $http.post(API.savePost + gid, {
                  user_id: res.id,
                  nickname: res.name,
                  head_portrait: res.src || '',
                  content: res.img,
                  content_type: 2,
                  send_time: data.time
                }).then(() => {
                  //保存正常发单记录
                  $http.post(API.savePost + gid, {
                    user_id: res.id,
                    nickname: res.name,
                    head_portrait: res.src || '',
                    content: res.info + `<br ><a class='link' href="${res.cms_url}">查看更多</a>`,
                    content_type: 1,
                    send_time: data.time
                  }).then(() => {
                    log('聊天记录_[SYS_1]', JSON.stringify({
                      user_id: res.id,
                      nickname: res.name,
                      head_portrait: res.src || '',
                      content: res.info + `<br ><a class='link' href="${res.cms_url}">查看更多</a>`,
                      content_type: 1,
                      send_time: data.time
                    }))
                  })
                  log('聊天记录_[SYS_2]', JSON.stringify({
                    user_id: res.id,
                    nickname: res.name,
                    head_portrait: res.src || '',
                    content: res.img,
                    content_type: 2,
                    send_time: data.time
                  }))
                }).catch((err) => {
                  console.log(err)
                })
              } else {
                //保存正常发单记录
                $http.post(API.savePost + gid, {
                  user_id: res.id || '',
                  nickname: res.name || '',
                  head_portrait: res.src || '',
                  content: res.cms_url ? res.info + `<br ><a class='link' href="${res.cms_url}">查看更多</a>` : res.info,
                  content_type: 1,
                  send_time: data.time
                }).then(() => {
                  log('聊天记录_[USER]', JSON.stringify({
                    user_id: res.id || '',
                    nickname: res.name || '',
                    head_portrait: res.src || '',
                    content: res.cms_url ? res.info + `<br ><a class='link' href="${res.cms_url}">查看更多</a>` : res.info,
                    content_type: 1,
                    send_time: data.time
                  }))
                })
              }

            }).catch(err => {
              ('err', 'get order' + JSON.stringify(err))
            })
          }

        });

        client.on("disconnect", function () {
          room.del(gid, client.uid)
          log('info', client.uname + " 离开聊天室");
        });
      });

    // 无定时任务则创建
    if (!(room.timed())) {
      room.add_timer(gid)
      log('msg', `***[${gid}] 定时任务已创建***`)
      // 定时发单
      setInterval(function () {
        if (CONFIG.TIME_START_TIME - 1 < new Date().getHours() && new Date().getHours() < CONFIG.TIME_END_TIME) {
          $http.get(API.postOrder + gid).then((res) => {
            res = JSON.parse(res)
            // 有队列生成则一直发送
            if (res.code === 200) {
              res.img = res.data.image_url
              res.info = res.data.content.replace(/(http.*)/ig, '<a class="link" href="$1">$1</a>').replace(/\n/ig, '<br>')
              res.src = "/chat/static/img/me.jpg"
              res.id = 10000
              res.name = '定时发单机器人'
              res.time = new Date().getTime()
              room.room[gid].forEach(e => {
                e.client.emit('serverMsg', res)
              })
              // client.broadcast.emit('serverMsg', res)
              // client.emit('serverMsg', res)
              log('info', `[${gid}]定时发单成功`)
              console.log('[', formatTime(new Date().getTime()), ']', '定时发单成功')
              // 保存找单图片
              if (res.img) {
                $http.post(API.savePost + gid, {
                  user_id: res.id,
                  nickname: res.name,
                  head_portrait: res.src || '',
                  content: res.img,
                  content_type: 2,
                  send_time: res.time
                }).then(() => {
                  //保存正常发单记录
                  $http.post(API.savePost + gid, {
                    user_id: res.id,
                    nickname: res.name,
                    head_portrait: res.src || '',
                    content: res.info,
                    content_type: 1,
                    // 第二条紧接着的信息不需要发送时间
                    send_time: ''
                  })
                }).catch(err => {
                  log('wan', `[${gid}]定时发单记录保存失败,${err || ''}`)
                })
              }
            } else {
              log('info', `[${gid}]发单队列为空`)
              console.log('[', formatTime(new Date().getTime()), ']', `[${gid}]发单队列为空`)
            }
          }).catch(({ err }) => {
            log('info', `[${gid}]定时发单失败 ${err || ''}`)
            console.log('[', formatTime(new Date().getTime()), ']', `[${gid}]定时发单失败`)
          })
        } else {
          log(`[${gid}]不在发单时间内`)
          console.log('[', formatTime(new Date().getTime()), ']', `[${gid}]不在发单时间内`)
        }
      }, CONFIG.TIME_INTERVAL)
    }
  }

  // 后台登录
  // router.get('/login', (req, res) => {
  //   res.render('login')
  // })

  // 管理界面
  // router.get('/admin', (req, res) => {
  //   res.render('admin', {
  //     socketArr: socketArr
  //   })
  // })
  let formatTime = (val) => {
    if (isNaN(val)) return ''
    var prefix = (s) => s < 10 ? '0' + s : s
    var date = new Date(val)
    return date.getFullYear() + '-' + prefix((date.getMonth() + 1)) + '-' + prefix(date.getDate()) + ' ' + prefix(date.getHours()) + ':' + prefix(date.getMinutes()) + ':' + prefix(date.getSeconds())
  }

  return router;
};