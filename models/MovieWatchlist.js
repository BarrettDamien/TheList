const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class MovieWatchlist extends Model {}

    MovieWatchlist.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user', // Reference to User model
                key: 'id',
            }
        },
        movieId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'movie', // Reference to Movie model
                key: 'imdbID',
            }
        }
    }, {
        sequelize, 
        modelName: 'moviewatchlist'
    })

    return MovieWatchlist;
};