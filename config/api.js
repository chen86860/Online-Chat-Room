const host = require('./conf').host

exports.getOrder = host + 'tbk_dev/chat/order/find/'
exports.postOrder = host + 'tbk_dev/chat/order/send/'
exports.savePost = host + 'tbk_dev/chat/record/save/'
exports.getPost = host + 'tbk_dev/chat/record/history/'