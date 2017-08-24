var redis = require('redis')
var CONFIG_REDIS = require('../config/conf').redis
var LOG = require('./log').log

var client = redis.createClient({
  host: CONFIG_REDIS.host,
  port: CONFIG_REDIS.port,
  password: CONFIG_REDIS.password,
})

client.on('error', (err) => {
  // LOG('[redis]', '连接错误' + err)
  console.log('Link BAD', err)
})

client.set('KEY1', 'key 1 values', (err, res) => {
  if (err) {
    console.log('set BAD', err)
  } else {
    console.log('set OK', res)
  }
})
client.get('KEY1', (err, res) => {
  if (err) {
    console.log('get BAD', err)
  } else {
    console.log('get OK', res)
  }
})
client.quit();