const http = require('http')
const URL = require('url')

exports.get = (url, params) => {
  if (!url) return new Error('url path is no valid')
  url = URL.parse(url)
  // url查询参数
  var query = '';
  if (params) Object.keys(params).forEach(e => { query += ('&' + e + '=' + params[e]) })
  // 以Promise方式调用
  return new Promise((resolve, reject) => {
    var req = http.request({
      hostname: url.hostname,
      path: url.pathname + query.replace('&', '?'),
      method: 'GET',
      host: url.host
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
  if (!url) return new Error('url path is no valid')
  url = URL.parse(url)
  return new Promise((resolve, reject) => {
    var req = http.request({
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      host: url.host
    }, (res) => {
      if (res.code !== 200 || res.code > 300) {
        reject(new Error('Error' + res.message))
      }
      let data = []
      res.on('data', (chunk) => {
        data.push(chunk)
      })
      res.on('end', () => {
        try {
          data = JSON.parse(Buffer.concat(data).toString())
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

