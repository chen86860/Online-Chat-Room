/**
 duoui  By 剁手帮前端组
 */

;
!(function () {
  var Class = function () {
    this.v = '1.0'
  }

  // 避免tochmove触发touchend
  Class.prototype.touch = function (obj, child, fn) {
    var move, type = typeof child === 'function',
      end = function (e) {
        var othis = $(this)
        if (othis.data('lock')) {
          return
        }
        move || fn.call(this, e)
        move = false
        othis.data('lock', 'true')
        setTimeout(function () {
          othis.data('lock', '')
          othis.removeAttr('data-lock')
        }, othis.data('locktime') || 0)
      }

    if (type) {
      fn = child
    }

    obj = typeof obj === 'string' ? $(obj) : obj

    if (!/Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/.test(navigator.userAgent)) {
      if (type) {
        obj.on('click', end)
      } else {
        obj.on('click', child, end)
      }
      return
    }

    if (type) {
      obj.on('touchmove', function () {
        move = true
      }).on('touchend', end)
    } else {
      obj.on('touchmove', child, function () {
        move = true
      }).on('touchend', child, end)
    }
  }

  // URL反系列化
  Class.prototype.unparam = function (search) {
    search = ((search || '').toString() || location.search).replace(/^[\s\S]*?\?/, '')
      .replace(/=/g, '":"').replace(/&/g, '","')
    try {
      return search === '' ? {} : JSON.parse('{"' + search + '"}')
    } catch (e) {
      return {}
    }
  }

  // 将普通对象按某个key排序
  Class.prototype.sort = function (data, key, asc) {
    var obj = JSON.parse(JSON.stringify(data))
    var compare = function (obj1, obj2) {
      var value1 = obj1[key]
      var value2 = obj2[key]
      if (value2 < value1) {
        return -1
      } else if (value2 > value1) {
        return 1
      } else {
        return 0
      }
    }
    obj.sort(compare)
    if (asc) obj.reverse()
    return obj
  }

  // 将字符转换为日期对象
  Class.prototype.date = function (time) {
    time = (time || '').replace(/T/g, ' ').replace(/-/g, '/')
    return new Date(time)
  }

  // 返回当前时间的多久前
  Class.prototype.time = function (time, brief) {
    var stamp = new Date().getTime() - time
    if (stamp > 1000 * 60 * 60 * 24 * 30) {
      stamp = new Date(time).toLocaleString()
      brief && (stamp = stamp.replace(/\s[\S]+$/g, ''))
      return stamp
    }
    if (stamp >= 1000 * 60 * 60 * 24) {
      return ((stamp / 1000 / 60 / 60 / 24) | 0) + '天前'
    } else if (stamp >= 1000 * 60 * 60) {
      return ((stamp / 1000 / 60 / 60) | 0) + '小时前'
    } else if (stamp >= 1000 * 60 * 5) {
      return ((stamp / 1000 / 60) | 0) + '分钟前'
    } else {
      return '刚刚'
    }
  }

  // cookie 获取cookie:duoui.cookie(name),设置cookie:duoui.cookie(n,v[,options])
  Class.prototype.cookie = function (e, o, t) {
    t = t || {}
    t.path = t.path || '/'
    t.domain = t.domain || '.fine3q.com'
    e = e || ''
    var n, i, r, a, c, p, s, d, u
    if (typeof o === 'undefined') {
      if (p = null, document.cookie && document.cookie != '') {
        for (s = document.cookie.split(';'), d = 0; d < s.length; d++) {
          if (u = $.trim(s[d]), u.substring(0, e.length + 1) == e + '=') {
            p = decodeURIComponent(u.substring(e.length + 1))
            break
          }
        }
      }
      return p
    }
    t = t || {}, o === null && (o = '', t.expires = -1), t.expires && (typeof t.expires === 'number' || t.expires.toUTCString) && (typeof t.expires === 'number' ? (i = new Date(), i.setTime(i.getTime() + 864e5 * t.expires)) : i = t.expires, n = '; expires=' + i.toUTCString()), r = t.path ? '; path=' + t.path : '', a = t.domain ? '; domain=' + t.domain : '', c = t.secure ? '; secure' : '', document.cookie = [e, '=', encodeURIComponent(o), n, r, a, c].join('')
  }

  Class.prototype.data = function (key, value, remove) {
    var data = {}
    try {
      data = JSON.parse(localStorage.duoui)
    } catch (e) { }

    if (value) data[key] = value
    if (remove) delete data[key]
    localStorage.duoui = JSON.stringify(data)
    return key ? data[key] : data
  }

  // 字符转义
  Class.prototype.parse = function (str) {
    return (str || '').replace(/\n/g, '<br>')
  }

  // 数位补齐
  Class.prototype.digit = function (num, length) {
    var str = ''
    num = String(num)
    length = length || 2
    for (var i = num.length; i < length; i++) {
      str += '0'
    }
    return num < Math.pow(10, length) ? str + (num | 0) : num
  }

  // hash路由
  Class.prototype.router = function (hash) {
    var hashs = (hash || location.hash).replace(/^#/, '').split('/') || []
    var item, param = {
      dir: []
    }
    for (var i = 0; i < hashs.length; i++) {
      item = hashs[i].split('=');
      /^\w+=/.test(hashs[i]) ? (function () {
        if (item[0] !== 'dir') {
          param[item[0]] = item[1]
        }
      }()) : param.dir.push(hashs[i])
      item = null
    }
    return param
  }

  // 倒计时
  Class.prototype.countDown = function (endTime, serverTime, callback) {
    var that = this,
      type = typeof serverTime === 'function'
    if (type) callback = serverTime
    var end = new Date(endTime).getTime()
    var now = new Date((!serverTime || type) ? new Date().getTime() : serverTime).getTime()
    var count = end - now,
      time = [
        Math.floor(count / (1000 * 60 * 60 * 24)), // 天
        Math.floor(count / (1000 * 60 * 60)) % 24, // 时
        Math.floor(count / (1000 * 60)) % 60, // 分
        Math.floor(count / 1000) % 60 // 秒
      ]

    var timer = setTimeout(function () {
      that.countDown(endTime, now + 1000, callback)
    }, 1000)

    callback && callback(count > 0 ? time : [0], serverTime, timer)

    if (count <= 0) clearTimeout(timer)

    return time
  }

  // Ajax
  Class.prototype.ajax = function (url, data, success, options) {
    var that = this,
      type = typeof data === 'function'
    if (type) {
      options = success
      success = data
      data = {}
    }

    data._ = new Date().getTime()
    options = options || {}

    return $.ajax({
      type: options.type || 'get',
      dataType: options.dataType || 'jsonp',
      data: data,
      url: url,
      timeout: options.timeout || 20 * 1000,
      contentType: options.contentType || 'application/x-www-form-urlencoded',
      success: function (res) {
        res = res || {}
        if (res.code == 1) {
          success && success(res.data, res)
        } else if (res.code == 46000) {
          // 未登录
          that.cookie('dsb_user_info', '')
          that.login()
        } else {
          layer.msg(res.message || '返回数据异常')
          options.error && options.error(res)
        }
      },
      error: function (e) {
        layer.msg('请求异常，请稍后重试')
        options.error && options.error(e)
      }
    })
  }

  // 微信jssdk
  Class.prototype.weixin = function (options, callback) {
    var that = this,
      device = duoui.device()
    if (typeof options === 'function') {
      callback = options
    }
    if (!device.weixin) {
      return callback && callback({})
    }
    options = options || {}
    that.ajax(that.api('web/weixin_ajax/get_wx_sign_info.json', options.host), {
      redirect_url: options.redirect || location.href
    }, function (res) {
      wx.config({
        debug: false,
        appId: res.app_id,
        timestamp: res.timestamp,
        nonceStr: res.nonce_str,
        signature: res.signature,
        jsApiList: [
          'onMenuShareTimeline', // 分享到朋友圈
          'onMenuShareAppMessage', // 分享给朋友
          'getNetworkType', // 获取网络状态
          'closeWindow', // 关闭当前webview
          'scanQRCode', // 微信扫一扫
          'chooseWXPay' // 微信支付
        ]
      })
      wx.ready(function () {
        var share = options.share
        if (share) {
          wx.onMenuShareTimeline({ // 分享到朋友圈
            title: share.title || '',
            link: share.link || location.href,
            imgUrl: share.imgUrl || 'http://cdn.firstlinkapp.com/upload/2016_7/1469862295493_11073.jpg',
            success: function () {
              share.success && share.success('timeline')
            }
          })
          wx.onMenuShareAppMessage({ // 分享给朋友
            title: share.title || '',
            desc: share.desc || '',
            link: share.link || location.href,
            imgUrl: share.imgUrl || 'http://cdn.firstlinkapp.com/upload/2016_7/1469862295493_11073.jpg',
            success: function () {
              share.success && share.success('message')
            }
          })
        }
        callback && callback(res)
      })
    })
  }

  // 微信分享指引 & Native 分享
  Class.prototype.share = function (share) {
    var device = duoui.device()
    if (device.weixin) {
      layer.open({
        type: 1,
        anim: false,
        shade: 'background-color:rgba(0,0,0,.8)',
        className: 'detail-here',
        style: 'position: fixed; top: 0; right:25px; background:none;',
        content: '<div class="duo-weixinHere"></div>'
      })
    } else if (device.firstlinkapp) {
      share.channels = 'all'
      duo.appCallback('weixinShare', share, share.success || function () {
        layer.msg('成功分享')
      })
    } else {
      layer.msg('请在微信或App环境中分享')
    }
  }

  // 分享成功后的兼容处理
  Class.prototype.shareEnd = function (res, callback) {
    try {
      res = JSON.parse(res)
    } catch (e) {
      res = {
        code: res
      }
    }
    if (res.code == 1) {
      typeof callback === 'function' && callback(res)
    }
  }

  // 手机验证码
  Class.prototype.vercode = function (options, callback) {
    options = options || {}

    // @龙迪
    if (duoui.cookie('outer_pid')) {
      options.fu_id = duoui.cookie('outer_pid')
      options.source = 'partner'
    }

    var that = this,
      time = options.time = 60,
      timer

    var d_id = that.cookie('d_id')
    if (!d_id) {
      d_id = new Date().toISOString() + '_' + Math.random().toString(36).slice(2)
      that.cookie('d_id', d_id)
    }

    // 发送验证码
    var sendCode = function (mobile) {
      that.ajax(that.api('api/user/get_verification_code.json'), {
        mobile: mobile,
        d_id: d_id
      })
    }

    // 弹出容器
    if (!options.elem) {
      var index = layer.open({
        type: 1,
        title: options.title || '绑定手机号',
        shadeClose: false,
        className: 'duo-vercode',
        style: 'position: absolute; top: 20px; left: 50%; margin-left: -150px; width:300px; max-width:300px;',
        content: '<p class="vercode-line"><input type="tel" placeholder="请输入手机号" id="vercode-mobile" value="' + (options.mobile || '') + '"><label id="vercode-time" data-locktime="2000">获取验证码</label></p>' + '<p class="vercode-line"><input type="tel" placeholder="请输入验证码" id="vercode-code" value=""></p>' + '<button class="duo-btn" id="vercode-btn" data-locktime="2000">确认</button>'
      })
    }

    var vercodeTime = $('#vercode-time'),
      vercodeBtn = $('#vercode-btn')
    var inputMobile = $('#vercode-mobile'),
      inputCode = $('#vercode-code')
    var endtime = function () {
      time--
      if (time === 0) {
        vercodeTime.html('重新发送')
        clearInterval(timer)
        return time = options.time
      }
      vercodeTime.html('<em>' + time + '</em>秒后重发')
    }

    // 非弹框模式
    if (options.elem) {
      vercodeTime = options.elem
      vercodeBtn = options.button
      inputMobile = options.inputMobile
      inputCode = options.inputCode
    }

    if (options.mobile) {
      if (/^1\d{10}$/g.test(options.mobile)) {
        sendCode(options.mobile)
        timer = setInterval(endtime, 1000)
      } else {
        layer.msg('手机格式不合法')
      }
    }

    // 获取验证码
    that.touch(vercodeTime, function () {
      if (time === options.time) {
        var mobile = inputMobile.val().replace(/\s/g, '')
        if (/^1\d{10}$/g.test(mobile)) {
          sendCode(mobile)
          timer = setInterval(endtime, 1000)
        } else {
          layer.msg('手机格式不合法')
        }
      }
    })

    // 提交
    that.touch(vercodeBtn, function () {
      var data = {
        mobile: inputMobile.val(),
        verification_code: inputCode.val()
      }
      if (/!^1\d{10}$/g.test(data.mobile)) {
        return layer.msg('手机格式不合法')
      }
      if (data.verification_code === '') {
        return layer.msg('请输入验证码')
      }
      typeof options.send === 'function' ? (
        options.send(data.mobile, callback),
        layer.close(index)
      ) : that.ajax(that.api('web/user_register_ajax/user_register.json'), {
        data_json: JSON.stringify(data),
        source: options.source || 'web',
        fu_id: options.fu_id || null,
        d_id: d_id
      }, function (res) {
        layer.close(index)
        layer.msg('成功绑定')
        callback(data.mobile, res)
      })
    })
  }

  // 打开一个url Schema
  Class.prototype.openApp = function (schema) {
    return location.href = schema
  }

  // 客户端桥
  Class.prototype.native = function () {
    var callId = 1,
      device = duoui.device()
    window.duo = window.duo || {}

    duo.CWVJB = function (callback) {
      if (device.firstlinkapp >= 1.22) { // 1.2.2版本 IOS端App采用全新webview
        if (window.WebViewJavascriptBridge) {
          return callback(WebViewJavascriptBridge)
        }
        if (window.WVJBCallbacks) {
          return window.WVJBCallbacks.push(callback)
        }
        window.WVJBCallbacks = [callback]
        var WVJBIframe = document.createElement('iframe')
        WVJBIframe.style.display = 'none'
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
        document.documentElement.appendChild(WVJBIframe)
        setTimeout(function () {
          document.documentElement.removeChild(WVJBIframe)
        }, 0)
      } else {
        if (window.WebViewJavascriptBridge) {
          callback(WebViewJavascriptBridge)
        } else {
          document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge)
          }, false)
        }
      }
    }

    duo.init = function (callback) {
      duo.appInfoInit = function (data) {
        duo.appInfo = JSON.parse(data)
      }
      duo.CWVJB(function (bridge) {
        if (device.firstlinkapp < 1.22) {
          bridge.init(function (message, initCallback) {
            initCallback()
          })
        }
        bridge.registerHandler('appInfoInit', function (data, responseCallback) {
          duo.appInfo = data
          responseCallback && responseCallback(data)
          callback && callback()
        })
      })
    }

    // ios与h5数据通信
    duo.iosBridge = function (handler, data, callback) {
      duo.CWVJB(function (bridge) {
        bridge.callHandler(handler, data, function (response) {
          callback(JSON.stringify(response))
        })
      })
    }

    // h5与安卓
    duo.androidBind = function (handler, data, callback) {
      var call_back

      if (typeof callback === 'function') {
        var call_back_name = 'callback' + (callId++)
        this[call_back_name] = callback
        call_back = 'window.duo.' + call_back_name
      } else if (callback) {
        call_back = callback
      }

      if (typeof data === 'object') {
        data = JSON.stringify(data)
      }

      if (this[handler]) {
        if (call_back) {
          this[handler](data, call_back)
        } else {
          this[handler](data)
        }
      } else {
        layer.msg(callbackName + ' 方法不存在')
      }
    }

    // Bridge就绪
    duo.ready = function (callback, sec) {
      var num = 0,
        timer = setInterval(function () {
          num++
          if (duo.appInfo) {
            clearInterval(timer)
            typeof callback === 'function' && callback(duo.appInfo)
          } else if (num > 20 * (sec || 10)) { // 若干秒（默认10s）内都无法检测appInfo的话，则建立失败
            clearInterval(timer)
            layer.msg('未成功与App建立Bridge' + (function () {
              return device.weixin ? '<br>请在剁手帮App中打开' : ''
            }()))
            typeof callback === 'function' && callback()
          }
        }, 50)
    }

    // app暴露接口名
    duo.appCallback = function (handler, data, callback) {
      duo.ready(function (appInfo) {
        if (duo.appInfo.p && duo.appInfo.p == 'i') { // IOS
          duo.iosBridge(handler, data, callback)
        } else if (duo.appInfo.p && duo.appInfo.p == 'a') { // 安卓
          duo.androidBind(handler, data, callback)
        }
      })
    }

    // 打开一个新的webview
    duo.openPageInNewWebView = function (url) {
      // 华为生活解决 建立bridge连接异常
      if (window.lives) {
        duoui.open(url, 1)
        return
      }

      duo.ready(function (appInfo) {
        if (!appInfo) {
          return duoui.open(url, 1)
        }
        if (appInfo.p === 'a') { // 安卓
          duo.appCallback('redirect', duoui.open(url))
        } else if (appInfo.p === 'i') { // IOS
          if (/^(\/)|(http(s*):\/\/)/.test(url)) {
            duo.appCallback('redirect', {
              url: duoui.open(url)
            })
          } else {
            duoui.openApp(url)
          }
        }
      }, 3)
    }

    // 自定义右上角bar
    duo.customBar = function (options, callback) {
      options = options || {}
      options.title = options.title || 'Button'
      options.method = options.method || 'customBar'
      if (device.firstlinkapp) {
        if (device.ios) {
          duo.ready(function (appInfo) {
            WebViewJavascriptBridge.registerHandler(options.method, callback)
            duo.appCallback('addCustomEventRightItem', {
              title: options.title,
              Handler: options.method
            }, callback)
          })
        } else if (device.android) {
          duo.appCallback('addActionbarMenuWithCallback', options.title, callback)
        }
      }
    }

    duo.init()
    return arguments.callee
  }

  // 如果检查到origin参数，则每次跳转都需带该参数
  Class.prototype.open = function (href, go) {
    var that = this,
      url = that.unparam()
    if (url.origin) {
      href = href + (/(&|\?)$/.test(href) ? '' : (/\?/.test(href) ? '&' : '?')) + 'origin=' + url.origin
    }
    if (!go) return href
    location.href = href
  }

  // 跳转到Detail页
  Class.prototype.openDetail = function (param) {
    var that = this
    var device = duoui.device()
    var dev = that.host() === 'dev' ? 'dev/' : ''

    param = param || {}

    if (device.firstlinkapp) {
      that.openApp('firstlinkapp://product.fine3q.com/detail?' + $.param(param))
    } else {
      that.open('//m.fine3q.com/' + dev + 'detail/index.html?' + $.param(param), 1)
      // var url = that.open('//m.fine3q.com/' + dev + 'detail/index.html?' + $.param(param));
      // window.open(url);
    }
  }

  // 跳转到专题页
  Class.prototype.openTopic = function (param) {
    var that = this
    var device = duoui.device()
    param = param || {}
    if (device.weixin) {
      that.open('//api.fine3q.com/link-site/mobile/product/topic.html?id=' + param.id, 1)
    } else if (device.firstlinkapp) {
      that.openApp('firstlinkapp://post.fine3q.com/topic_post_list?topic_id=' + param.id)
    } else {
      that.open('//api.fine3q.com/link-site/mobile/product/topic.html?id=' + param.id, 1)
    }
  }

  // 判断设备
  Class.prototype.device = function () {
    var agent = navigator.userAgent.toLowerCase()

    // 将版本字符转化成浮点型
    var parseVersion = function (label) {
      var exp = new RegExp(label + '/([^\\s\\_\\-]+)')
      label = (agent.match(exp) || [])[1]
      return label ? label.replace(/(?!^\d+\.)(\b\d+)./g, '$1') : false
    }

    var result = {
      os: (function () {
        if (/windows/.test(agent)) {
          return 'windows'
        } else if (/linux/.test(agent)) {
          return 'linux'
        } else if (/|iphone|ipod|ipad|symbianos|ios/.test(agent)) {
          return 'ios'
        }
      }()),
      // 是否微信

      weixin: parseVersion('micromessenger'),
      // 是否剁手帮App

      firstlinkapp: parseVersion('firstlinkapp')
    }
    result.android = /android/.test(agent)
    result.ios = result.os === 'ios'
    return result
  }

  // 拼接CDN静态资源参数
  Class.prototype.formatImg = function (url, parame) {
    if (url && typeof url === 'string') {
      return url.indexOf('cdn.firstlinkapp.com') !== -1 ? (url + parame) : url
    } else {
      return null
    }
  }

  // 判断环境
  Class.prototype.host = function () {
    var formal = /\b(m|mapi|api)\.fine3q\.com\b/.test(location.host)
    var dev = /\/dev\//.test(location.pathname)
    return formal ? (dev ? 'dev' : 'online') : 'dev'
  }

  // 判断所处环境接口
  // Class.prototype.api = function(url, host) {
  //   var formal = /\b((m|mapi|api)\.fine3q\.com)|duoms\.duoshoubang\.cn\b/.test(location.host);
  //   var dev = /\/dev\//.test(location.pathname);
  //   return 'http://' + (host ? host : function() {
  //     return formal ? (
  //       dev ? 'dev' : 'api'
  //     ) : 'dev';
  //   }()) + '.fine3q.com/' + (host === 'mapi' ? 'get' : 'link-site') + '/' + url;
  // };

  // 重构 prototype.api()
  // * 去掉了走 nodeJS 代理的逻辑
  Class.prototype.api = function (url, host) {
    // #判断是线上还是测试环境
    var env = 'dev'
    // 先通过域名和路径信息判断
    var env_prod = /\b((m|mapi|api)\.fine3q\.com)|duoms\.duoshoubang\.cn\b/.test(location.host)
    var env_dev = /\/dev\//.test(location.pathname)
    if (env_prod) {
      env = env_dev ? 'dev' : 'prod'
    } else {
      // 如果不是 m|mapi|api.fine3q.com 或者 duoms.duoshoubang.cn, 一律默认按测试环境算
      env = 'dev'
    }
    // 如果传了 host 参数, 以 host 参数的环境为准
    // host 参数兼容新老两种形式(mapi, fetest | prod, dev);
    if (host === 'mapi' || host === 'prod') {
      env = 'prod'
    } else if (host === 'fetest' || host === 'dev') {
      env = 'dev'
    }

    // * 修复 url 地址前缀 "/link-site";
    // * 为防止以后有地址不是 link-site 目录下的,
    // * 这里根据 老 api 函数的逻辑, 仅自动补全 #不以 "/" 开头的 url 参数#
    if (url.indexOf('/') !== 0) {
      url = '/link-site/' + url
    }
    // 开始处理不同环境下的请求地址
    var ret = 'http://api.fine3q.com'
    /* if (env === 'prod') {
      ret = 'http://api.fine3q.com';
    } */

    ret += url

    return ret
  }

  // 重新包装 login 方法, 适配各种合作伙伴渠道
  // (目前主要是 华为生活[huaweiLive])
  Class.prototype.login = function (callback, args) {
    args = args || {}
    var partner = this.getPartnerInfo()
    // 8500: 华为生活
    if (partner === '8500' || partner === '8506') {
      this.huaweiLiveLogin(callback, args)
      return
    }

    // 其它渠道, 走以前老登录
    if (!args.host) {
      // 自动适应登录环境
      args.host = (this.host() === 'online') ? 'mapi' : 'fetest'
    }
    this._login(callback, args)
  }

  // 获取 partner 合作伙伴渠道信息
  Class.prototype.getPartnerInfo = function () {
    var ret = null

    // 先从 url query 上面获取
    // 然后优先从 cookie 里进行获取
    // 最后通过 全局对象, UA 等特殊方式进行判断
    var query = this.unparam()
    if (query.outer_pid) {
      ret = query.outer_pid
    } else if (this.cookie('outer_pid')) {
      // 如果 url 上不带 outer_pid, 优先从 cookie 里取
      ret = this.cookie('outer_pid')
    } else if (window.lives) {
      // 华为生活
      ret = '8500'
    } else if (/_sogou_8504$/.test(navigator.userAgent)) {
      // 搜狗海淘 app
      ret = '8504'
    }

    // 取到outer_pid 时写入 cookie, 供服务端使用
    if (ret) {
      this.cookie('outer_pid', ret)
      // var cookie = 'outer_pid=' + ret + ';path=/;max-age=7200';
      // document.cookie = cookie;
    }

    // 根据ua设置c_id
    if (/_(\d*)_sogou_8504$/.test(navigator.userAgent)) {
      // 搜狗海淘 app
      var info = navigator.userAgent.match(/_(\d*)_sogou_8504$/)
      if (info && info.length >= 2) {
        this.cookie('c_id', info[1])
      }
    }

    return ret
  }

  // 华为生活登录
  Class.prototype.huaweiLiveLogin = function (callback, args) {
    var _this = this
    // 先设置获取 token 的回调
    window.setAccessToken = function (at_resp) {
      at_resp = JSON.parse(at_resp)
      if (at_resp.code != 200) {
        return
      }

      $.ajax({
        url: _this.api('web/huawei_ajax/login.json'),
        data: {
          access_token: at_resp.accessToken,
          huawei_source: at_resp.source
        },
        dataType: 'jsonp',
        success: function (resp) {
          window.setAccessToken = null
          resp = resp || {}
          // TOKEN 过期或失效
          if (resp.code == '46005') {
            args.overdue = true
            _this.huaweiLiveLogin(callback, args)
            return
          }
          // 其它意外情况
          if (resp.code != 1) {
            return
          }

          if (resp.data.regist_mark == 0) {
            if (typeof args.registMarkHandler === 'function') {
              args.registMarkHandler(resp.data, {
                tk: at_resp.accessToken,
                huaweiSource: at_resp.source
              })
            } else {
              _this.huaweiLiveBinding({
                tk: at_resp.accessToken,
                huaweiSource: at_resp.source
              }, callback)
            }
            return
          }

          if (typeof callback === 'function') {
            callback(resp)
          }
        },
        error: function () {
          window.setAccessToken = null
        }
      })
    }

    // 获取 token
    var overdue = !!args.overdue
    window.lives.getAccessToken('duoshoubang', overdue)
  }

  // 华为生活账号绑定
  Class.prototype.huaweiLiveBinding = function (options) {
    document.cookie = 'hwt=' + options.tk + ';domain=fine3q.com;path=/;'
    document.cookie = 'hws=' + options.huaweiSource + ';domain=fine3q.com;path=/;'

    var target = '//m.fine3q.com/dev/user/bind-phone.html'
    // 如果不是测试环境, 就当做线上环境
    if (location.href.indexOf('m.fine3q.com/dev') === -1) {
      target = '//m.fine3q.com/user/bind-phone.html'
    }
    var ref = typeof this.unparam === 'function' ? this.unparam().ref : null
    target += '?ref=' + (ref || encodeURIComponent(location.href))

    location.href = target
  }

  window.huaweiLiveBinding = Class.prototype.huaweiLiveBinding

  // 登入
  Class.prototype._login = function (callback, options) {
    options = options || {}

    var that = this
    var unionid = that.cookie('unionid')
    var isstr = typeof options === 'string'
    var host = isstr ? options : options.host
    var device = duoui.device()
    var userinfo = duoui.cookie('dsb_user_info') || duoui.cookie('DUO_USER_INFO')

    userinfo = userinfo ? userinfo.replace(/^"|\\|"$/g, '') : '{}'
    userinfo = JSON.parse(userinfo)

    // 微信环境
    var weixinLogin = function () {
      function auth () {
        var redirectURI = encodeURIComponent('https://api.fine3q.com/link-site/web/weixin/set_wx_user_info_to_cookie.do?redirect_url=' + encodeURIComponent(location.href))
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx29b4f4d1f6839e5a&redirect_uri=' + redirectURI + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
      }

      if (!unionid) {
        auth()
        return
      }
      that.ajax(that.api('web/weixin_ajax/get_user_info.json', host), {
        unionid: unionid
      }, function (user) {
        if (user.is_new == 0 && !userinfo.user_id) {
          return auth()
        }
        if (user.is_new == 1 && !options.noreg) {
          return duoui.vercode({
            title: '新用户绑定手机号',
            source: options.source,
            fu_id: options.fu_id
          }, function () {
            location.reload()
          })
        }
        callback && callback(user, userinfo)
      })
    }

    // 浏览器环境
    var otherLogin = function () {
      if (userinfo.user_id) {
        return callback && callback(userinfo)
      }
      location.href = '//m.fine3q.com/' + (host === 'fetest' ? 'dev/' : (/\/dev\//.test(location.pathname) ? 'dev/' : '')) + 'user/login.html?redirect=' + encodeURIComponent(location.href)
    }

    // App环境
    var appLogin = function () {
      duo.appCallback('getUserInfo', {
        force_login: true
      }, function (res) {
        var appInfo = duo.appInfo || {}
        res = JSON.parse(res)
        if (!res.id) {
          return duoui.login.index = layer.open({
            time: 0,
            content: '您需要登入才能访问该页面',
            shadeClose: false,
            btn: ['立即登入'],
            yes: function () {
              appLogin()
            }
          })
        }
        that.cookie('u_id', res.id)
        that.cookie('tk', res.token)
        that.cookie('d_id', appInfo.d_id)
        that.cookie('c_id', appInfo.c_id)
        that.cookie('ver', appInfo.ver)
        that.cookie('ts', appInfo.ts)
        that.cookie('p', appInfo.p)
        callback && callback(res)
        layer.close(duoui.login.index)
      })
    }

    // 各环境判断
    if (duoui.device().weixin) {
      weixinLogin()
    } else if (device.firstlinkapp) {
      appLogin()
    } else {
      otherLogin()
    }

    return userinfo
  }

  // 下载App链接
  Class.prototype.download = function () {
    return 'http://a.app.qq.com/o/simple.jsp?pkgname=com.firstlink.duo'
  }

  // 顶部下载App文案
  Class.prototype.downApp = function (options) {
    var partner = this.getPartnerInfo()
    // 合作伙伴里不显示下载工具条
    if (partner && partner != '8502') {
      return
    }
    var meta = {
      default: {
        title: '剁手帮App',
        name: 'duo',
        downloadUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.firstlink.duo'
      },
      '8502': {
        title: '嗨买剁手帮',
        name: 'himai',
        downloadUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.firstlink.himai'
      }
    }

    options = options || {}
    if (!options.className) {
      options.className = ''
    }
    var app = meta.default
    if (partner && meta[partner]) {
      app = meta[partner]
      options.className += (' app-' + app.name)
    }
    var that = this
    var html = $('<header class="download-app ' + (options.className || '') + '">\
    <i class="app-logo"></i>\
    <div class="app-desc">\
      <h2>' + app.title + '</h2>\
      <p>' + (options.text || '全球好货，尽在掌握') + '</p>\
    </div>\
    <a href="' + app.downloadUrl + '" class="down-btn">立即下载</a>\
    <i class="duo-close down-close"></i>\
  </header>')

    if ($('.download-app')[0]) {
      return
    }
    options.getstr || $('body').prepend(html)

    // 删除
    that.touch('body', '.down-close', function () {
      $(this).parent().remove()
      options.remove && options.remove()
    })

    return html
  }

  // 重新包装 fixedBar, 在 huaweiLive 里面输出不同内容
  Class.prototype.fixedBar = function () {
    var partner = this.getPartnerInfo()
    if (partner !== '8500') {
      this._fixedBar()
      return
    }

    // 放纸重复输出
    if ($('#nav-toolbar').length) {
      return
    }
    // 开始处理在 huaweiLive 里面的输出内容
    var html = '<div id="nav-toolbar">'
    html += '<div class="fixed-box">'
    html += '<div class="nav-item item-home">'
    html += '<a class="nav-link" data-act="home" href="#">'
    html += '<span class="link-icon"></span>'
    html += '<span class="link-text">首页</span>'
    html += '</a>'
    html += '</div>'
    html += '<div class="nav-item item-catalog">'
    html += '<a class="nav-link" data-act="catalog" href="#">'
    html += '<span class="link-icon"></span>'
    html += '<span class="link-text">分类</span>'
    html += '</a>'
    html += '</div>'
    html += '<div class="nav-item item-cart">'
    html += '<a class="nav-link" data-act="cart" href="#">'
    html += '<span class="link-icon"></span>'
    html += '<span class="link-text">购物车</span>'
    html += '</a>'
    html += '</div>'
    html += '<div class="nav-item item-profile">'
    html += '<a class="nav-link" data-act="profile" href="#">'
    html += '<span class="link-icon"></span>'
    html += '<span class="link-text">我的</span>'
    html += '</a>'
    html += '</div>'
    html += '</div>'
    html += '</div>'

    // 输出内容到页面
    $('body').append(html)
    // 处理跳转事件
    var _this = this
    var device = this.device()
    var root_path = (this.host() === 'online') ? '' : '/dev'
    var host = '//m.fine3q.com' + root_path

    $('#nav-toolbar .nav-link').click(function (evt) {
      evt.preventDefault()
      var node = $(this)
      var act = node.attr('data-act')
      // 处理 "首页" 点击
      if (act === 'home') {
        if (device.firstlinkapp) {
          location.href = 'firstlinkapp://index.fine3q.com'
          return
        }
        var home = host + '/home/index.html'
        if (partner === '8500') {
          home = host + '/huaweilive/index.html'
        }

        location.href = home
        return
      }
      // 处理 "分类" 点击
      if (act === 'catalog') {
        var catalog = host + '/catalog/index.html'
        location.href = catalog

        return
      }
      // 处理 "购物车" 点击
      if (act === 'cart') {
        _this.login(function () {
          var cart = host + '/cart/index.html'
          location.href = cart
        })

        return
      }
      // 处理 "我的" 点击
      if (act === 'profile') {
        var profile = host + '/profile/index.html'
        location.href = profile
      }
    })
  }

  // 右下角Bar
  Class.prototype._fixedBar = function (options) {
    var that = this
    var device = duoui.device()

    if ($('.duo-fixedbar')[0]) return

    // 如果是华为生活，则不输出
    if (window.lives) {
      return
    }

    var html = ['<ul class="duo-fixedbar">', '<li data-type="gohome"><img src="//cdn.firstlinkapp.com/upload/2016_7/1469417375122_42580.png"></li>', '</ul>'].join('')

    $('body').append(html)

    // 操作
    var active = {
      gohome: function () {
        location.href = device.firstlinkapp ? 'firstlinkapp://index.fine3q.com' : '//m.fine3q.com/home/index.html'
      }
    }

    that.touch('.duo-fixedbar li', function () {
      var othis = $(this)
      active[othis.data('type')].call(this, othis)
    })
  }

  // 仿Native滑动
  Class.prototype.dScroll = function (options) {
    options = options || {}
    var gather = {},
      elem = $(options.elem),
      relat = elem.offset().left // 元素与窗口左距离
    var width = elem.width(),
      elemWidth = elem[0].scrollWidth,
      scroll

    function anim (time, translate) {
      elem.css({
        '-webkit-transition': (time || 0) + 's',
        'transition': (time || 0) + 's',
        '-webkit-transform': 'translate3d(' + translate + 'px, 0px, 0px)',
        'transform': 'translate3d(' + translate + 'px, 0px, 0px)'
      })
    }

    gather.last = 0

    // 定位到某处
    if (options.index) {
      var child = elem.children().eq(options.index)
      gather.last = -child.width() * options.index
      anim(0.5, gather.last)
    }

    elem.on('touchstart', function (e) {
      var touche = e.touches[0],
        pagex = touche.pageX - relat
      gather.start = pagex
      gather.startTime = new Date().getTime()
    }).on('touchmove', function (e) {
      e.preventDefault()
      var touche = e.touches[0],
        pagex = touche.pageX - relat
      var direc = pagex - gather.start // 判断是左滑还是右滑

      gather.direc = direc

      scroll = true

      // 只能在规定区域触发拖动
      if (pagex >= 0 && pagex <= width) {
        var last = gather.direc + gather.last
        if (last >= width / 2 || last <= -(elemWidth - width / 2)) return
        anim(0, last)
      }
    }).on('touchend', function () {
      if (!scroll) return

      var direc = (gather.direc | 0)
      gather.endTime = new Date().getTime()

      var time = gather.endTime - gather.startTime

      gather.last = gather.last + direc

      gather.last = gather.last + (width * 2) * direc / time
      anim(1, gather.last)
      if (gather.last >= 0) {
        gather.last = 0
        anim(0.5, gather.last)
      }
      if (gather.last <= -(elemWidth - width - (options.margin | 0))) {
        gather.last = -(elemWidth - width - (options.margin | 0))
        anim(0.5, gather.last)
      }

      scroll = false
    })
  }

  // 下拉上拉刷新
  Class.prototype.refresh = function (options) {
    var gather = {}
    var scroll

    var icon = $('<div class="duo-refresh"></div>')

    if (!$('.duo-refresh')[0]) {
      $('body').prepend(icon)
    }

    function anim (time, translate) {
      var s = 'rotateZ(' + (360 * translate / options.space) + 'deg) translateY(' + translate + 'px)'
      $('.duo-refresh').css({
        '-webkit-transition': (time || 0) + 's',
        'transition': (time || 0) + 's',
        'top': translate - 55,
        '-webkit-transform': 'rotateZ(' + (360 * translate / options.space) + 'deg)',
        'transform': 'rotateZ(' + (360 * translate / options.space) + 'deg)'
      })
      if (time > 0 && gather.direc > 80) {
        icon.addClass('duo-infinite')
        setTimeout(function () {
          options.end ? options.end() : location.reload()
        }, 1000)
      }
    }

    options = options || {}
    options.space = options.space || 150
    options.time = options.time || 0.5

    $(window).on('touchstart', function (e) {
      var touche = e.touches[0],
        pagey = touche.pageY
      gather.start = pagey
    }).on('touchmove', function (e) {
      var touche = e.touches[0],
        pagey = touche.pageY
      var direc = pagey - gather.start

      gather.direc = direc

      scroll = true

      var scrollY = window.scrollY

      // 下拉
      if (scrollY === 0 && direc > 0) {
        if (direc > 1) {
          e.preventDefault()
        }
        if (direc > options.space) {
          return gather.direc = options.space
        }
        anim(0, gather.direc)
        options.move && options.move(gather.direc / options.space)
      }
    }).on('touchend', function () {
      if (!scroll) return

      // 下拉操作的 还原
      if (gather.direc > 0 && gather.direc <= options.space) {
        anim(options.time, gather.direc > 80 ? 80 : 0)
      }

      scroll = false
    })
  }

  // 抽奖转盘
  Class.prototype.wheel = function (index, options) {
    options = options || {}
    options.elem = options.elem || $('.wheel-pan')
    options.angle = options.angle || 60 // 平均角度
    options.secs = options.secs || 6 // 所需总秒数
    options.loop = options.loop || 5 // 循环转圈数

    // 按照接口返回结果，定位转盘指针
    var rotateZ = (duoui.wheel.rotateZ | 0) + 360 * options.loop + options.angle * index - options.angle * (duoui.wheel.index | 0)

    options.elem.css({
      'transition-duration': options.secs + 's',
      '-webkit-transition-duration': options.secs + 's',
      'transform': 'rotateZ(' + rotateZ + 'deg)',
      '-webkit-transform': 'rotateZ(' + rotateZ + 'deg)'
    })

    duoui.wheel.rotateZ = rotateZ
    duoui.wheel.index = index

    // 结束转动的回调
    setTimeout(function () {
      typeof options.end === 'function' && options.end(index)
    }, options.secs * 1000)

    return duoui
  }

  // 图片预加载
  Class.prototype.img = function (url, callback) {
    var img = new Image()
    img.src = url

    if (img.complete) {
      return callback && callback(img)
    }

    img.onload = function () {
      img.onload = null
      callback && callback(img)
    }
    img.onerror = function (e) {
      img.onload = null
      callback && callback(img, e)
    }
  }

  // 图片按屏加载
  Class.prototype.lazyimg = function (options) {
    var index = 0,
      winHeight = $(window).height()
    options = options || {}
    var that = this,
      elem = options.elem || '.duo-lazyimg',
      show = function (item, callback) {
        var start = document.body.scrollTop,
          end = start + winHeight
        var elemTop = item.offset().top

        /* 始终只加载在当前屏范围内的图片 */
        // if (elemTop >= start && elemTop <= end) {
        // 解决android 返回 上面图片没加载的问题
        if (elemTop <= end) {
          if (!item.attr('src')) {
            var src = item.data('src')
            that.img(src, function () {
              var next = duoui.lazyimg.elem.eq(index)
              item.attr('src', src)
              item.parents('.duoms-loading').removeClass('duoms-loading')
              /* 删除loading */
              if (parseInt(item.css('min-height')) > 0) {
                item.css('min-height', '0')
                /* 删除最小高度 */
              }
              /* item.removeClass(elem.replace(/^.|#/, ''));    删除选择器 */

              /* 当前图片加载就绪后，检测下一个图片是否在当前屏 */
              next[0] && render(next)
              callback && callback()
            })
          }
        }
      },
      render = function (othis, scroll) {
        var start = document.body.scrollTop,
          end = start + winHeight

        if (!scroll) {
          duoui.lazyimg.elem = $(elem)
        }

        if (othis) {
          show(othis, function () {
            index++
          })
        } else {
          for (var i = 0; i < duoui.lazyimg.elem.length; i++) {
            var item = duoui.lazyimg.elem.eq(i),
              elemTop = item.offset().top
            show(item)
            index = i
            if (elemTop > end) break
          }
        }
      }

    render()

    if (!duoui.lazyimg.have) {
      $(window).on('scroll', function () {
        render(null, true)
      })
      duoui.lazyimg.have = true
    }

    return render
  }

  // 信息流加载
  Class.prototype.flow = function (options, callback) {
    var page = 1
    var lock

    options = options || {}
    options.mb = options.mb || 50 // 与底部的临界距离
    if (typeof options === 'function') {
      callback = options
    }
    document.addEventListener('scroll', function () {
      var top = document.body.scrollTop,
        height = document.body.clientHeight
      var winHeight = document.documentElement.clientHeight

      // 临界点 - 检测是否与整个document为参考对象
      var done = options.elem ? (options.elem.offset().top + options.elem.height()) : height

      // 临界点
      if (((top + winHeight + options.mb) >= done)) {
        if (!lock) {
          lock = true
          callback && callback(++page)
        }
      } else if (lock) {
        lock = null
      }
    }, false)
  }

  // 刮刮卡
  Class.prototype.scratch = function (options) {
    var canvas = options.canvas[0]
    var context = canvas.getContext('2d')

    options = options || {}

    context.fillCircle = function (x, y, radius, fillColor) {
      this.fillStyle = fillColor
      this.moveTo(x, y)
      this.beginPath()
      this.arc(x, y, radius, 0, Math.PI * 2, false)
      this.fill()
      this.closePath()
    }

    context.clearTo = function (fillColor) {
      context.fillStyle = fillColor
      context.fillRect(0, 0, options.width, options.height)
    }

    context.clearTo('#ddd')

    // 隐藏画布
    var hideCanvas = function () {
      var data = context.getImageData(0, 0, options.width, options.height).data
      for (var i = 0, j = 0; i < data.length; i += 4) {
        if (data[i] && data[i + 1] && data[i + 2] && data[i + 3]) {
          j++
        }
      }
      if (j <= options.width * options.height * 0.4) {
        canvas.style.display = 'none'
      }
    }

    duoui.img(options.imgSrc, function (img) {
      context.drawImage(img, 0, 0, options.width, options.height)

      canvas.addEventListener('touchstart', function (e) {
        e.preventDefault()
        canvas.isDrawing = true
      }, false)

      canvas.addEventListener('touchmove', function (e) {
        e.preventDefault()

        var canvasX = options.canvas.offset().left
        var canvasY = options.canvas.offset().top

        if (!canvas.isDrawing) {
          return
        }
        var touche = e.touches[0]
        var x = touche.pageX - canvasX
        var y = touche.pageY - canvasY

        var radius = 25
        context.globalCompositeOperation = 'destination-out'
        context.fillCircle(x, y, radius)

        hideCanvas()
      }, false)

      canvas.addEventListener('touchend', function (e) {
        e.preventDefault()
        canvas.isDrawing = false
      }, false)

      options.success && options.success()
    })
  }

  // webim
  Class.prototype.webim = function (options) {
    var config = {
      // 租户id 
      tenantId: '1814',
      // 环信移动客服域，固定值，请按照示例配置
      domain: '//kefu.easemob.com',
      // agentName: 'shizhang@duoshoubang.cn',               
      // 自己服务器上im.html文件的路径
      path: '//m.fine3q.com/webim',
      // 访客插件static的路径
      staticPath: '//static.fine3q.com/res/webim/static'
    }

    var userInfo = decodeURIComponent(this.cookie('dsb_user_info') || this.cookie('DUO_USER_INFO'))
    userInfo = userInfo && JSON.parse(userInfo)

    if (userInfo) {
      config.visitor = {
        userNickname: userInfo.nk,
        trueName: userInfo.u_id
      }
    }

    if (options) {
      config.extMsg = {
        'imageName': 'mallImage3.png',
        // custom代表自定义消息，无需修改
        'type': 'custom',
        'msgtype': {
          'track': {
            'title': options.title || '剁手帮移动客服',
            'price': options.price,
            'desc': options.desc || '剁手帮致力于全球商品代购服务',
            'img_url': options.img_url || '//cdn.firstlinkapp.com/static/img/logo_fillet.png',
            'item_url': options.item_url || location.href
          }
        }
      }
    }
    easemobim && easemobim.bind && easemobim.bind(config)
  }

  if (window.layer) {
    // 提示
    layer.msg = function (content, options, end) {
      var type = typeof options === 'function'
      if (type) end = options

      return layer.open($.extend({
        time: 2,
        anim: false,
        content: content,
        shade: false,
        shadeClose: false,
        style: 'max-width: 300px; box-shadow: none; text-align:center; border:none; font-size:14px; background-color: rgba(0,0,0,.7); color:#fff; word-wrap: break-word; white-space: pre-wrap;',
        end: end
      }, type ? {} : options))
    }

    // loading
    layer.load = function () {
      return layer.open({
        type: 2,
        shadeClose: false,
        className: 'duo-loading',
        anim: false
      })
    }
  }

  var duoui = new Class()
  duoui.native() // 和Native建立通讯

  // 默认调用一下 getPartnerInfo 方法
  // 检查 outer_pid 信息, 并记录到 cookie 里
  duoui.getPartnerInfo()

  typeof define === 'function' ? define(function () {
    return duoui
  }) : typeof exports !== 'undefined' ? module.exports = duoui : window.duoui = duoui
}())
