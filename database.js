var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        // Create user table
        db.run(`CREATE TABLE user (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT, 
            email TEXT UNIQUE, 
            password TEXT, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (username, email, password) VALUES (?,?,?)'
                db.run(insert, ["admin","admin@example.com",md5("admin123456")])
                db.run(insert, ["user","user@example.com",md5("user123456")])
            }
        });

        // Create sharedWatchlist table
        db.run(`CREATE TABLE sharedWatchlist (
            shared_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES user (user_id),
            FOREIGN KEY (watchlist_id) REFERENCES watchlist (watchlist_id)
        )`, (err) => {
            if (!err) {
                // Initial insert if needed
                console.log("Shared watchlist table created successfully.");
            }
        });

        // Create watchlist table
        db.run(`CREATE TABLE watchlist (
            watchlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES user (user_id)
        )`, (err) => {
            if (!err) {
                // Initial insert if needed
                console.log("Watchlist table created successfully.");
            }
        });

        // Create watchlist_item table
        db.run(`CREATE TABLE watchlist_item (
            watchlist_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            watchlist_id INTEGER,
            movie_id INTEGER,
            tvShow_id INTEGER,
            status TEXT,
            FOREIGN KEY (watchlist_id) REFERENCES watchlist (watchlist_id),
            FOREIGN KEY (movie_id) REFERENCES movies (movie_id),
            FOREIGN KEY (tvShow_id) REFERENCES tvShows (tvShow_id)
        )`, (err) => {
            if (!err) {
                // Initial insert if needed
                console.log("Watchlist Item table created successfully.");
            }
        });

        // Create randomizerHistory table
        db.run(`CREATE TABLE randomizerHistory (
            history_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            watchlist_item_id INTEGER,
            date_modified TEXT,
            FOREIGN KEY (watchlist_item_id) REFERENCES watchlist_item (watchlist_item_id)
        )`, (err) => {
            if (!err) {
                // Initial insert if needed
                console.log("Randomiser History table created successfully.");
            }
        });

        // Create movies table
        db.run(`CREATE TABLE movies (
            movie_id INTEGER PRIMARY KEY AUTOINCREMENT,
            movie_title TEXT,
            release_year TEXT,
            genre TEXT,
            duration INTEGER,
            omdb_id TEXT,
            FOREIGN KEY (movie_id) REFERENCES watchlist_item (movie_id)
        )`, (err) => {
            if (!err) {
                // Initial insert if needed
                console.log("Movie watchlist table created successfully.");
            }
        });

        // Create tvShows table
        db.run(`CREATE TABLE tvShows (
            tvShow_id INTEGER PRIMARY KEY AUTOINCREMENT,
            tvShow_title TEXT,
            release_year TEXT,
            genre TEXT,
            seasons INTEGER,
            episodes INTEGER,
            tvdb_id TEXT,
            FOREIGN KEY (tvShow_id) REFERENCES watchlist_item (tvShow_id)
        )`, (err) => {
            if (!err) {
                // Initial insert if needed
                console.log("TV Show watchlist table created successfully.");
            }
        });

    }
});

module.exports = db