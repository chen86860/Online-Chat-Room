const host = require('./conf').host

module.exports = {
  getOrder: host + 'tbk_dev/chat/order/find/',
  postOrder: host + 'tbk_dev/chat/order/send/',
  savePost: host + 'tbk_dev/chat/record/save/',
  getPost: host + 'tbk_dev/chat/record/history/'
}


'http://dev.adbats.com/tbk_dev/chat/order/find/0'