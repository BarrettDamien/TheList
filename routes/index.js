var express = require('express');
var router = express.Router();
const watchlistRoutes = require('./watchlist');

/* GET home page. */
/* router.get('/', function(req, res, next) {
  if(req.user) {
    res.render('index', { username: req.user.username });
  } else {
    res.redirect('/auth/signup') // adjusts where unauthed users are pointed to 
  }
}); */

router.get('/', function(req, res, next) {
  res.render('index', { username: req.user ? req.user.username : null });
});

/* router.use('/watchlist', watchlistRoutes); */

module.exports = router;
