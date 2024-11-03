var express = require('express');
var path = require('path');
var { sequelize } = require('./database');
var session = require('express-session')
var passport = require('passport');

sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
}).catch((error) => {
    console.error('Error syncing database:', error);
});

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var watchlistRouter = require('./routes/watchlist');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'SECRETKEY', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/watchlist', watchlistRouter);

module.exports = app;
