const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class TVShow extends Model {}

    TVShow.init({
        tvdbID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        }
        // Add more fields if needed
    }, {
        sequelize, 
        modelName: 'tvshow',
        tableName: 'tvshow'
    })

    return TVShow;
};