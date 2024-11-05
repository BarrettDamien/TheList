const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite', // or 'mysql', 'postgres', etc., depending on your database
    storage: './db.sqlite', // Path to SQLite file
    logging: console.log,
})

const User = require('./models/User')(sequelize)
const MovieWatchlist = require('./models/MovieWatchlist')(sequelize)
const TVWatchlist = require('./models/TVWatchlist')(sequelize)
const Movie = require('./models/Movie')(sequelize)
const TVShow = require('./models/TVShow')(sequelize)

module.exports = { sequelize, User, MovieWatchlist, TVWatchlist, Movie, TVShow };