const { Sequelize } = require('sequelize')

const sequelize = process.env.DATABASE_URL ? new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Necessary for Heroku SSL configuration
        },
    },
})
    : new Sequelize(
        process.env.DATABASE_NAME, // Default to 'theListDB' for local dev if not set
        process.env.DATABASE_USER, // Local fallback username
        process.env.DATABASE_PASSWORD, // Local fallback password
        {
            host: process.env.DATABASE_HOST, // Default to localhost for local dev
            dialect: 'postgres',
            port: process.env.DATABASE_PORT, // Default PostgreSQL port
            logging: console.log, // Optional: set to `false` to disable query logging
        }
    )

const User = require('./models/User')(sequelize)
const MovieWatchlist = require('./models/MovieWatchlist')(sequelize)
const TVWatchlist = require('./models/TVWatchlist')(sequelize)
const Movie = require('./models/Movie')(sequelize)
const TVShow = require('./models/TVShow')(sequelize)

module.exports = { sequelize, User, MovieWatchlist, TVWatchlist, Movie, TVShow }