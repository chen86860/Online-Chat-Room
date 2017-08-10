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

// var $http = require('../base/http')
// var fs = require('fs')

// $http.get('http://cms.adbats.com/cms/item/search', {
//   page: 2,
//   size: 10,
//   sort: 'itemSale,desc'
// }).then((res) => {
//   console.log(JSON.parse(res).code)
//   fs.appendFileSync('result.json', res)
//   // console.log(res)
// }).catch(err => {
//   console.log('err', err)
// })

// $http.post('http://tower.adbats.com/open/taobao/getTaokouling', {
//   item_id: 1679193096,
//   pid: 'mm_122396730_23766697_79224551',
//   title: '沙发床多功能小户型可折叠沙发床70cm单人双人简易沙发布艺特价',
//   logo: 'http://img01.taobaocdn.com/bao/uploaded/i1/T1.slAXlNxXXbqL6.9_103919.jpg',
//   source_type: 3
// }).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log('err', err)
// })

const dbHandler = require('../base/mysql')
dbHandler.query(`insert into user(username,password) values('i * i','i * i * i')`, (err, res, fields) => {
  if (err) {
    console.log(res)
  } else {
    console.log(res.affectedRows === 1)
  }
})
