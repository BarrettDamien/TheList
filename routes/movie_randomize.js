const express = require('express');
//const axios = require('axios');
const router = express.Router();
const { Movie, MovieWatchlist } = require('../models');
const { Op } = require('sequelize'); //sequelize operator

// Randomize Movies
router.get('/', async (req, res) => {
    const genre = req.query.q;
    const userId = req.user ? req.user.id : null;
    
    if (!userId) {
        return res.status(401).json({ error: 'User must be logged in to use this feature.' });
    }

    try {
        // Query user's watchlist
        const moviesInWatchlist = await MovieWatchlist.findAll({
            where: { userId },
            include: [
                {
                    model: Movie,
                    where: genre
                        ? { genre: { [Op.like]: `%${genre}%` } }
                        : {},  // Optional genre filter
                },
            ],
        });

        if (moviesInWatchlist.length > 0) {
            // Pick a random movie from the watchlist
            const randomMovie = moviesInWatchlist[Math.floor(Math.random() * moviesInWatchlist.length)];
            res.json(randomMovie.Movie);  // Send the associated Movie details
        } else {
            res.status(404).json({ error: 'No movies found in your watchlist for this genre.' });
        }
    } catch (error) {
        console.error('Error getting random movie:', error);
        res.status(500).json({ error: 'Server error while getting random movie.' });
    }
});

router.get('/test-randomize', (req, res) => {
    res.send('Randomizer route is working!');
});

module.exports = router;
