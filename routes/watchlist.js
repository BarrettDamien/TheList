const express = require('express');
const axios = require('axios');
const router = express.Router();
const MovieWatchlist = require('../models/MovieWatchlist');
const TVWatchlist = require('../models/TVWatchlist');

const OMDB_API_KEY = '144a0d98'; 

// Define routes within /watchlist here
router.get('/search', async (req, res) => {
    /* Search function */
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

router.post('/', async (req, res) => {
    try {
        const { userId } = req.user; // Assuming userId is stored in req.user
        const { movieId } = req.body; // Get movieId from the request body

        // Create a new entry in the MovieWatchlist
        const newWatchlistEntry = await MovieWatchlist.create({
            userId: userId,
            movieId: movieId,
        });

        res.status(201).json(newWatchlistEntry);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while adding to the watchlist.');
    }
    /* const { imdbID, title } = req.body;

    if (!imdbID || !title) {
        return res.status(400).send('Missing required fields.');
    }

    try {
        // Insert movie into the watchlist using the Watchlist model
        await MovieWatchlist.create({ imdbID, title });
        res.status(201).send('Movie added to watchlist.');
    } catch (error) {
        console.error('Error adding movie to watchlist:', error);
        res.status(500).send('An error occurred while adding the movie to the watchlist.');
    } */
});

router.get('/', (req, res) => {
    /* Fetch watchlist function */
    if(req.user) {
        res.render('watchlist', { user: req.user  }); // Pass user ID to the template
    } else {
        res.redirect('/auth/login');
    }
});

// Add to Movie Watchlist
router.post('/movie', async (req, res) => {
    try {
        const { userId, movieId } = req.body; // Ensure these fields are sent in the request body
        await MovieWatchlist.create({ userId, movieId });
        res.status(201).send({ message: 'Movie added to watchlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred. Please try again.' });
    }
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
});

module.exports = router;
