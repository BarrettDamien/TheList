var express = require('express');
var router = express.Router();
const watchlistRoutes = require('./watchlist');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { username: req.user ? req.user.username : null });
});

/* router.use('/watchlist', watchlistRoutes); */

module.exports = router;
