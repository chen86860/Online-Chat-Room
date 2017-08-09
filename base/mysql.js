const mysql = require('mysql')
const dbConfig = require('../config/conf')

var pool = mysql.createPool(dbConfig.db)

let query = (query, callback = noop) => {
  if (!query || typeof query != 'string') return callback(true, new Error('query is no undefined'))
  pool.getConnection((err, connection) => {
    if (err) {
      return callback(true, new Error('connect failed', err))
    } else {
      connection.query(query, (err, res, fields) => {
        if (err) {
          return callback(true, new Error(new Date(), 'query failed', err))
        } else {
          connection.release()
          callback(false, res, fields)
        }
      })
    }
  })
}

let log = (content) => {
  return Promise((resolve, reject) => {
    if (Object.prototype.toString.apply(content) !== '[object object]') reject(new Error('content is not object'))
    let body = {
      gId: '',
      time: content.time || new Date(),
      id: content.id || 1000,
      username: content.username || '',
      avator: '',
      type: content.type || 1, // 1 代表文本，2代表图片
      content: content.body || ''
    }
    query(`insert into log(time,id,username,type,content) values(${body.time},${body.id},${body.username},${body.type},${body.content})`, (err, res, fields) => {
      if (err) {
        reject(new Error('log failed', err))
      } else {
        if (res.affectedRows === 1) {
          resolve()
        } else {
          reject(new Error('log failed', err))
        }
      }
    })
  })
}
let noop = () => { }

exports.query = query
exports.log = log