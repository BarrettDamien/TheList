const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class TVWatchlist extends Model {
        static associate(models) {
            // Define the relationship here
            TVWatchlist.belongsTo(models.TVShow, { foreignKey: 'tvShowId' })
            TVWatchlist.belongsTo(models.User, { foreignKey: 'userId' })
        }
    }

    TVWatchlist.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user', // Reference to User model
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        tvShowId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tvshow', // Reference to TVShow model
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    }, {
        sequelize, 
        modelName: 'tv_watchlist',
        tableName: 'tv_watchlist',
        timestamps: true,
    })

    return TVWatchlist
};