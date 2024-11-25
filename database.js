const { Sequelize } = require('sequelize')

/* const sequelize = new Sequelize({
    dialect: 'sqlite', // or 'mysql', 'postgres', etc., depending on your database
    storage: './db.sqlite', // Path to SQLite file
    logging: console.log,
}) */

/* const sequelize = new Sequelize(
    process.env.DATABASE_URL, // Use DATABASE_URL from environment variables for production
    process.env.DATABASE_USER, 
    process.env.DATABASE_PASSWORD, 
    {
        host: process.env.DATABASE_HOST, 
        dialect: 'postgres',
        port: process.env.DATABASE_PORT, 
        logging: console.log, // Optional: set to `false` to disable query logging
        dialectOptions: process.env.DATABASE_URL ? {
        ssl: {
            require: true,
            rejectUnauthorized: false // For Heroku SSL configuration
        }
        } : {}
    }
) */

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
    process.env.DATABASE_NAME || 'theListDB', // Default to 'theListDB' for local dev if not set
    process.env.DATABASE_USER || 'your_local_db_user', // Local fallback username
    process.env.DATABASE_PASSWORD || 'your_local_db_password', // Local fallback password
    {
    host: process.env.DATABASE_HOST || '127.0.0.1', // Default to localhost for local dev
    dialect: 'postgres',
    port: process.env.DATABASE_PORT || 5432, // Default PostgreSQL port
    logging: console.log, // Optional: set to `false` to disable query logging
    }
)

const User = require('./models/User')(sequelize)
const MovieWatchlist = require('./models/MovieWatchlist')(sequelize)
const TVWatchlist = require('./models/TVWatchlist')(sequelize)
const Movie = require('./models/Movie')(sequelize)
const TVShow = require('./models/TVShow')(sequelize)

module.exports = { sequelize, User, MovieWatchlist, TVWatchlist, Movie, TVShow }