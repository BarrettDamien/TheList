//const { Sequelize } = require('sequelize')
const { User, MovieWatchlist, TVWatchlist, Movie, TVShow } = require('../database'); // Import the models from database.js
const sequelize = require('../database').sequelize // Import sequelize instance from database.js

// Invoke the `associate` methods for all models
if (User.associate) User.associate({ MovieWatchlist, TVWatchlist, Movie, TVShow });
if (Movie.associate) Movie.associate({ MovieWatchlist, User });
if (MovieWatchlist.associate) MovieWatchlist.associate({ Movie, User });
if (TVShow.associate) TVShow.associate({ TVWatchlist, User });
if (TVWatchlist.associate) TVWatchlist.associate({ TVShow, User });

module.exports = {
    sequelize,
    User,
    MovieWatchlist,
    TVWatchlist,
    Movie, 
    TVShow
}