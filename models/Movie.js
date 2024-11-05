const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Movie extends Model {}

    Movie.init({
        imdbID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,  // Ensures that each movie is only added once
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        year: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        genre: {
            type: DataTypes.STRING,
        },
        runtime: {
            type: DataTypes.STRING,
        }
        // Add more fields if needed
    }, {
        sequelize, 
        modelName: 'movie',
        tableName: 'movie'
    })

    return Movie;
};