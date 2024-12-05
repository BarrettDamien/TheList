const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class MovieWatchlist extends Model {
        static associate(models) {
            // Define the relationship here
            MovieWatchlist.belongsTo(models.Movie, { foreignKey: 'movieId' })
            MovieWatchlist.belongsTo(models.User, { foreignKey: 'userId' })
        }
    }

    MovieWatchlist.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'movie',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    }, {
        sequelize, 
        modelName: 'movie_watchlist',
        tableName: 'movie_watchlist',
        timestamps: true,
    })

    return MovieWatchlist
};