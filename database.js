const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('my-db', 'user', 'pass', {
    dialect: 'sqlite',
    storage: './db.sqlite'
})

const User = require('./models/User')(sequelize);
const MovieWatchlist = require('./models/MovieWatchlist')(sequelize);
const TVWatchlist = require('./models/TVWatchlist')(sequelize);
const Movie = require('./models/Movie')(sequelize);
const TVShow = require('./models/TVShow')(sequelize);

/* const initModels = () => {
    const User = require('./models/User')(sequelize, Sequelize.DataTypes);
    const MovieWatchlist = require('./models/MovieWatchlist')(sequelize, Sequelize.DataTypes);
    const TVWatchlist = require('./models/TVWatchlist')(sequelize, Sequelize.DataTypes);
    const Movie = require('./models/Movie')(sequelize, Sequelize.DataTypes);
    const TVShow = require('./models/TVShow')(sequelize, Sequelize.DataTypes);
} */


// Sync models with database
/* const syncDatabase = async () => {
    try {
        /* initModels();
        await sequelize.sync( { force:true } );
        console.log('Database & tables created!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}; */

// Call syncDatabase when the app starts
/* syncDatabase();
 */
module.exports = { sequelize, User, MovieWatchlist, TVWatchlist, Movie, TVShow }