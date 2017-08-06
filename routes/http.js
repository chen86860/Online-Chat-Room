// var http = require("http");
// var fs = require("fs");

// httpRequest = (params, postData) => {
//   return new Promise(function(resolve, reject) {
//     var req = http.request(params, function(res) {
//       // reject on bad status
//       if (res.statusCode < 200 || res.statusCode >= 300) {
//         return reject(new Error("statusCode=" + res.statusCode));
//       }
//       // cumulate data
//       var body = [];
//       res.on("data", function(chunk) {
//         body.push(chunk);
//       });
//       // resolve on end
//       res.on("end", function() {
//         try {
//           body = JSON.parse(Buffer.concat(body).toString());
//         } catch (e) {
//           reject(e);
//         }
//         resolve(body);
//       });
//     });
//     // reject on request error
//     req.on("error", function(err) {
//       // This is not a "Second reject", just a different sort of failure
//       reject(err);
//     });
//     if (postData) {
//       req.write(postData);
//     }
//     // IMPORTANT
//     req.end();
//   });
// };

var $http = require('../base/http')
var fs = require('fs')

$http.get('http://cms.adbats.com/cms/item/search', {
  page: 2,
  size: 10,
  sort: 'itemSale,desc'
}).then((res) => {
  console.log(JSON.parse(res).code)
  fs.appendFileSync('result.json', res)
  // console.log(res)
}).catch(err => {
  console.log('err', err)
})