var dotenv = require('dotenv')
dotenv.config()

var express = require('express')
var path = require('path')
var { sequelize } = require('./database')
var session = require('express-session')
var passport = require('passport')

sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Unable to connect to the database:', err));


sequelize.sync({  }).then(() => { //add 'force: true' to curly brackets to drop tables when app boots
    console.log('Database & tables created!')
}).catch((error) => {
    console.error('Error syncing database:', error)
})

var indexRouter = require('./routes/index')
var authRouter = require('./routes/auth')
var watchlistRouter = require('./routes/watchlist')
var tvWatchlistRouter = require('./routes/tv_watchlist')
var movieRandomRouter = require('./routes/movie_randomize')
var tvRandomRouter = require('./routes/tv_randomize')
var mergedRandomRouter = require('./routes/merged_randomize')

var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/watchlist', watchlistRouter)
app.use('/tv-watchlist', tvWatchlistRouter)
app.use('/randomize', movieRandomRouter)
app.use('/randomize-tv', tvRandomRouter)
app.use('/randomize-all', mergedRandomRouter)

module.exports = app
