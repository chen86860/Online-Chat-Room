(function () {

  var Class = function () {
    this.v = 'v1.0.0'
  }
  Class.prototype.share = function (options) {
    var share = options.share
    var redirect = options.redirect
    var ua = window.navigator.userAgent
    if (!/micromessenger/ig.test(ua.toLowerCase())) return
    $.ajax({
      url: 'http://dev.adbats.com/tbk_dev/weixin/sign?redirect_url=' + redirect,
      type: 'GET',
      dataType: 'jsonp',
      success: function (res) {
        wx.config({
          debug: false,
          appId: res.data.app_id,
          timestamp: res.data.timestamp || new Date().getTime(),
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
        })

        wx.ready(function () {
          if (share) {
            wx.onMenuShareTimeline({
              title: share.title || 'MUI', // 分享标题
              link: share.link || window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: share.imgUrl || '', // 分享图标
              success: function () {
                // 用户确认分享后执行的回调函数
                share.success && share.success('timeline')
              }
            });

            wx.onMenuShareAppMessage({
              title: share.title || '', // 分享标题
              desc: share.desc || '', // 分享描述
              link: share.link || '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: share.imgUrl || '', // 分享图标
              type: share.type || 'link', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户确认分享后执行的回调函数
                share.success && share.success('appmessage')
              }
            });
          }
        })

        wx.error(function (err) {
          console.log(err)
        })

      }
    })
  }

  /**
   * AJAX请求
   * 
   * @param {any} url  必填
   * @param {any} method  默认GET
   * @param {any} params 请求参数，为对象格式。默认为空值
   * @param {any} callback  回调函数
   * @returns 
   */
  Class.prototype.ajax = function (url, method, params, callback) {
    if (Object.prototype.toString.apply(url) !== '[object String]') callback && callback(new Error('URL不能为空'))
    if (Object.prototype.toString.apply(params) !== '[object Object]') callback && callback(new Error('参数必须为对象'))
    var _method = method.toUpperCase() || 'GET'
    var _params = ''
    Object.keys(params).forEach((e, i, a) => {
      _params += (e + '=' + params[e] + (i === a.length - 1 ? '' : '&'))
    })
    var xhr = new XMLHttpRequest() || new XMLHttpRequest("microsoft.XMLHTTP") || new XMLHttpRequest();
    if (xhr) {
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var responseData = xhr.responseText || false;
          callback(false, JSON.parse(responseData));
        } else {
          callback('AJAX Failed');
        }
      };
      xhr.send(encodeURIComponent(_params));
      return true;
    } else {
      alert('Sorry,your browser doesn\'t support XMLHttpRequeset');
      return false;
    }
  }

  // Class.prototype.init = function () {
  //   if (/micromessager/ig.test(window.navigator.userAgent.toLocaleLowerCase)) {
  //     this.ajax('http://dev.adbats.com/tbk_dev/weixin/sign', 'GET', {
  //       redirect_url: redirect_url
  //     }, function (err, result) {

  //     })
  //   }
  // }

  // Class.prototype.ua = function(){
  //   var u = window.navigator.userAgent
  //   switch(u){
  //     u.test(/android/ig): return 'android'
  //   }
  // }
  var mui = new Class()
  typeof define === 'function' ? define(function () {
    return mui
  }) : typeof exports !== 'undefined' ? module.exports = mui : window.mui = mui
})()