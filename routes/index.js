var express = require('express');
var router = express.Router();

/* GET home page. */
router
  .get('/', function (req, res, next) {
    res.render('index');
  })
  .post('/', (req, res, next) => {
    console.log(req.body.item_id)
    console.log(req.body)
    res.json({
      msg: 'OK'
    })
  })

module.exports = router;
