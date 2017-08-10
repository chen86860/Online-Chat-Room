const http = require('http')
const URL = require('url')
const querystring = require('querystring')

exports.get = (url, params) => {
  return new Promise((resolve, reject) => {
    if (!url || typeof url !== 'string') reject(new Error('url path is no valid'))
    url = URL.parse(url)
    // url查询参数
    let query = ''
    if (params) Object.keys(params).forEach(e => { query += ('&' + e + '=' + params[e]) })
    // 以Promise方式调用
    let req = http.request({
      hostname: url.hostname,
      path: url.pathname + query.replace('&', '?'),
      method: 'GET',
      host: url.host,
      port: url.port || 80,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }, (res) => {
      if (res.statusCode !== 200 || res.statusCode > 300) {
        reject(new Error('Error' + res.statusMessage))
      }
      let data = ''
      res.on('data', (chunk) => {
        data += chunk.toString()
      })
      res.on('end', () => {
        try {
          data = JSON.parse(JSON.stringify(data))
        }
        catch (e) {
          reject(e)
        }
        resolve(data)
      })
    })

    req.on('error', (err) => {
      reject(err)
    })
    req.end()
  })
}

exports.post = (url, params) => {
  return new Promise((resolve, reject) => {
    if (!url) reject(new Error('url is no valid'))
    if (params) params = querystring.stringify(params)
    url = URL.parse(url)
    let req = http.request({
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      host: url.host,
      port: url.port || 80,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(params)
      }
    }, (res) => {
      if (res.statusCode !== 200 || res.statusCode > 300) {
        reject(new Error(res.statusMessage))
      }
      res.setEncoding('utf8');
      let data = ''
      res.on('data', (chunk) => {
        data += chunk.toString()
      })
      res.on('end', () => {
        try {
          data = JSON.parse(JSON.stringify(data))
        }
        catch (e) {
          reject(e)
        }
        resolve(data)
      })
    })

    req.on('error', (err) => {
      reject(err)
    })
    // 发送参数
    if (params) req.write(params)
    req.end()
  })
}

