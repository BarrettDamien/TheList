const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class TVShow extends Model {
        static associate(models) {
            // Define the relationship here
            TVShow.hasMany(models.TVWatchlist, { foreignKey: 'tvShowId' })
        }
    }

    TVShow.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        imdbID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensures that each TV Show is only added once
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        year: {
            type: DataTypes.STRING,
        },
        genre: {
            type: DataTypes.STRING,
        },
        seasons: {
            type: DataTypes.INTEGER,
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
        modelName: 'tvshow',
        tableName: 'tvshow',
        timestamps: true,
    })

    return TVShow
};