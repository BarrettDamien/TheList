const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Movie extends Model {
        static associate(models) {
            // Define the relationship here
            Movie.hasMany(models.MovieWatchlist, { foreignKey: 'movieId' })
        }
    }

    Movie.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        imdbID: {
            type: DataTypes.STRING,
            allowNull: false,
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
        },
        type: {
            type: DataTypes.STRING,
        },
        poster: {
            type: DataTypes.STRING,
        },
        plot: {
            type: DataTypes.STRING,
        },
        // Add more fields if needed
    }, {
        sequelize, 
        modelName: 'movie',
        tableName: 'movie',
        timestamps: true,
    })

    return Movie
}