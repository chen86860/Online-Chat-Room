var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index')
});


router.route('/')
    .get(function (req, res, next) {
        if (!req.cookie.user) {
            res.render('sign');
        } else {
            res.render('/')
        }
    });

router.route('sign').get(function (req, res, next) {
    res.render('sign');
})
    .post(function (req, res, next) {
        if (users[req.body.username]) {
            res.redirect('/sign')
        } else {
            res.cookie('user', req, body.username, {maxAge: 1000 * 60 * 60 * 24 * 30});
            res.redirect('/')

        }
    });
module.exports = router;
