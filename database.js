const { Sequelize } = require('sequelize')

/* const sequelize = new Sequelize({
    dialect: 'sqlite', // or 'mysql', 'postgres', etc., depending on your database
    storage: './db.sqlite', // Path to SQLite file
    logging: console.log,
}) */

const sequelize = new Sequelize(
    process.env.DATABASE_URL || 'theListDB', // Use DATABASE_URL from environment variables for production
    process.env.DATABASE_USER || 'Zaedriel', // Local dev fallback
    process.env.DATABASE_PASSWORD || 'jme6vzx0kgh7gpd_EQH', // Local dev fallback
    {
        host: process.env.DATABASE_HOST || '127.0.0.1', // Local dev fallback
        dialect: 'postgres',
        port: process.env.DATABASE_PORT || 5432, // PostgreSQL default port
        logging: console.log, // Optional: set to `false` to disable query logging
        dialectOptions: process.env.DATABASE_URL ? {
        ssl: {
            require: true,
            rejectUnauthorized: false // For Heroku SSL configuration
        }
        } : {}
    }
)

const User = require('./models/User')(sequelize)
const MovieWatchlist = require('./models/MovieWatchlist')(sequelize)
const TVWatchlist = require('./models/TVWatchlist')(sequelize)
const Movie = require('./models/Movie')(sequelize)
const TVShow = require('./models/TVShow')(sequelize)

module.exports = { sequelize, User, MovieWatchlist, TVWatchlist, Movie, TVShow }