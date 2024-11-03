const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class User extends Model {}

    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        salt: {
            type: DataTypes.STRING(64),
            allowNull: false
        }
    }, {
        sequelize, 
        modelName: 'user'
    })

    return User;
}

// models/User.js
/* const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class User extends Model {}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'user'
});

module.exports = User; */
