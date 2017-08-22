var fs = require('fs')
exports.log = function (type, msg) {
  if (!msg) return
  fs.appendFile('./log/index', `${date()}[${type}]:${msg}\n`, (err) => {
    if (err) {
      console.log(date(), '日志记录错误', err)
    }
  })
}

let date = function (ms) {
  return '[' + formatTime(new Date().getTime()) + '] '
}

let formatTime = (val) => {
  if (isNaN(val)) return ''
  var prefix = (s) => s < 10 ? '0' + s : s
  var date = new Date(val)
  return date.getFullYear() + '-' + prefix((date.getMonth() + 1)) + '-' + prefix(date.getDate()) + ' ' + prefix(date.getHours()) + ':' + prefix(date.getMinutes()) + ':' + prefix(date.getSeconds())
}