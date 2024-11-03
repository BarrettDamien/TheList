const { Sequelize } = require('sequelize');
// const User = require('./models/User');
// const MovieWatchlist = require('./models/MovieWatchlist');
// const TVWatchlist = require('./models/TVWatchlist');
// const Movie = require('./models/Movie');
// const TVShow = require('./models/TVShow');

const sequelize = new Sequelize('my-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './db.sqlite'
})

// Sync models with database
const syncDatabase = async () => {
    await sequelize.sync();
    console.log('Database & tables created!');
};

// Call syncDatabase when the app starts
// syncDatabase();

module.exports = sequelize