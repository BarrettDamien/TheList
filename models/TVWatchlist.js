const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class TVWatchlist extends Model {}

    TVWatchlist.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user', // Reference to User model
                key: 'id',
            }
        },
        tvShowId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'tvshow', // Reference to TVShow model
                key: 'id',
            }
        }
    }, {
        sequelize, 
        modelName: 'tv_watchlist',
        tableName: 'tv_watchlist'
    })

    return TVWatchlist;
};