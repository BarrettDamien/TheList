const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class User extends Model {
        static associate(models) {
            // A user can have many movie watchlist items
            User.hasMany(models.MovieWatchlist, { foreignKey: 'userId', onDelete: 'CASCADE' })
            // A user can have many TV watchlist items
            User.hasMany(models.TVWatchlist, { foreignKey: 'userId', onDelete: 'CASCADE' })
        }
    }

    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize, 
        modelName: 'user',
        tableName: 'user',
        timestamps: true,
    })

    return User
}