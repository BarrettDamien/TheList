const express = require('express');
const axios = require('axios');
const router = express.Router();
const { sequelize, User, MovieWatchlist, Movie, TVWatchlist } = require('../models');
const OMDB_API_KEY = '144a0d98'; 

// Main home page login reset page
router.get('/', (req, res) => {
    if(req.user) {
        res.render('watchlist', { user: req.user  }); // Pass user ID to the template
    } else {
        res.redirect('/auth/login');
    }
});

router.get('/watchlist', (req, res) => {
    if(req.user) {
        res.render('watchlist', { user: req.user  }); // Pass user ID to the template
    } else {
        res.redirect('/auth/login');
    }
});

// Search OMDB via GET API endpoints
router.get('/search', async (req, res) => {
    const searchQuery = req.query.q;
    
    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' });
    }
    
    try {
        const response = await axios.get(`http://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=${OMDB_API_KEY}`);
        
        if (response.data.Response === 'True') {
            res.json(response.data.Search);  // Send search results back to client
        } else {
            res.status(404).json({ error: response.data.Error });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching' });
    }
}); 

// From the GET request, POST request to add to watchlist directly
router.post('/add-to-watchlist', async (req, res) => {
    const { imdbID } = req.body

    // Ensure user is logged in safety net
    if (!req.user) {
        return res.status(401).json({ error: 'User must be logged in to add to watchlist' });
    }

    const userId = req.user.id

    //console.log('Incoming data:', { imdbID, userId });

    try {
        // Fetch movie data from OMDb API based on the imdbID
        const movieResponse = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);

        if (movieResponse.data.Response === 'True') {
            const movieData = movieResponse.data;

            // Add movie to your database, ensuring to find or create the record
            const [movieRecord, created] = await Movie.findOrCreate({
                where: { imdbID: movieData.imdbID }, // Use imdbID to ensure uniqueness
                defaults: {
                    title: movieData.Title,
                    year: movieData.Year,
                    genre: movieData.Genre,
                    runtime: movieData.Runtime,
                    // Add other fields
                }
            });

            console.log('Inserting into MovieWatchlist:', { userId, movieId: movieRecord.id  });

            // Check for existing entry before creating
            const existingEntry = await MovieWatchlist.findOne({
                where: { userId: userId, movieId: movieRecord.id  }
            });

            if (existingEntry) {
                return res.status(409).json({ error: 'Movie already in watchlist' });
            }

            // Add the movie to the user's watchlist
            await MovieWatchlist.create({
                userId: userId,
                movieId: movieRecord.id ,
            });

            return res.status(201).json({ message: '/routes/watchlist.js - Movie added to watchlist', movie: movieRecord });
        } else {
            return res.status(404).json({ error: '/routes/watchlist.js - Movie not found' });
        }
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        return res.status(500).json({ error: '/routes/watchlist.js - 500 error' });
    }
});

// Add to Movie Watchlist
/* router.post('/movie', async (req, res) => {
    try {
        const { userId, movieId } = req.body; // Ensure these fields are sent in the request body
        await MovieWatchlist.create({ userId, movieId });
        res.status(201).send({ message: 'Movie added to watchlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred. Please try again.' });
    }
    console.log('MovieWatchlist:', MovieWatchlist);
    console.log('Is MovieWatchlist a model?', MovieWatchlist instanceof sequelize.Model); // Should be true
});

// Add to TV Watchlist
router.post('/tv', async (req, res) => {
    try {
        const { userId, tvShowId } = req.body; // Ensure these fields are sent in the request body
        await TVWatchlist.create({ userId, tvShowId });
        res.status(201).send({ message: 'TV show added to watchlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred. Please try again.' });
    }
    console.log('TVWatchlist:', MovieWatchlist);
    console.log('Is TVWatchlist a model?', MovieWatchlist instanceof sequelize.Model); // Should be true
}); */

module.exports = router;
