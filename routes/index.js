var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    res.render('index', { username: req.user.username });
  } else {
    res.redirect('/auth/login')
  }
});

module.exports = router;
