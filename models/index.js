//const { Sequelize } = require('sequelize')
const { User, MovieWatchlist, TVWatchlist, Movie, TVShow } = require('../database'); // Import the models from database.js
const sequelize = require('../database').sequelize // Import sequelize instance from database.js

module.exports = {
    sequelize,
    User,
    MovieWatchlist,
    TVWatchlist,
    Movie, 
    TVShow
}