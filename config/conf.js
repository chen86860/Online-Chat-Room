module.exports = {
  // 数据库配置
  db: {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'user'
  },
  redis: {
    host: '118.31.112.250',
    port: '6379',
    password: 'adbats0412'
  },
  // 服务器地址
  host: 'http://cps.adbats.com/',
  // 发单间隔
  TIME_INTERVAL: 1000 * 10,
  // 发单起止时间
  TIME_START_TIME: 8,
  TIME_END_TIME: 22
}