var redis = require("redis");
var CONFIG_REDIS = require('../config/conf').redis

var sub = redis.createClient({
  host: CONFIG_REDIS.host,
  port: CONFIG_REDIS.port,
  password: CONFIG_REDIS.password,
});

var pub = redis.createClient({
  host: CONFIG_REDIS.host,
  port: CONFIG_REDIS.port,
  password: CONFIG_REDIS.password,
});
var msg_count = 0;

// sub.on("subscribe", function (channel) {
//   pub.publish(channel, "I am sending a message.");
//   pub.publish(channel, "I am sending a second message.");
//   // pub.publish(channel, "I am sending my last message.");
// });

// sub.on("message", function (channel, message) {
//   console.log("sub channel " + channel + ": " + message);
//   msg_count += 1;
//   if (msg_count === 2) {
//     sub.unsubscribe();
//     sub.quit();
//     pub.quit();
//   }
// });

// sub.subscribe("a nice channel");




sub.on('subscribe', (channel) => {
  console.log(channel)
  sub.unsubscribe()
  sub.quit()
  pub.quit()
})

// pub.publish(channel, value)


sub.emit('subscribe','Hello')
// sub.subscribe('Hello')


// pub.publish('')