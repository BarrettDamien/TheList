const express = require('express');
const router = express.Router();
const { Movie, MovieWatchlist } = require('../models');
const { Op } = require('sequelize'); //sequelize operator

/* router.get('/', async (req, res) => {
    // This renders the randomize.ejs view
    res.render('randomize'); // Ensure 'randomize' is the name of your EJS file (without .ejs extension)
}); */

router.get('/', (req, res) => {
    if(req.user) {
        res.render('randomize', { user: req.user  }); // Pass user ID to the template
    } else {
        res.redirect('/auth/login');
    }
});

// Randomize Movies
router.get('/randomize', async (req, res) => {
    const genre = req.query.q;
    const userId = req.user ? req.user.id : null;

    if (!userId) {
        console.log("User not logged in");
        return res.status(401).json({ error: 'User must be logged in to use this feature.' });
    }

    try {
        // Query user's movie watchlist
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

        console.log('Movies in Watchlist:', JSON.stringify(moviesInWatchlist, null, 2));

        if (moviesInWatchlist.length > 0) {
            // Pick a random movie from the watchlist
            const randomMovie = moviesInWatchlist[Math.floor(Math.random() * moviesInWatchlist.length)];

            //res.setHeader('Content-Type', 'application/json');
            console.log('Randomly Selected Movie:', JSON.stringify(randomMovie, null, 2));
            /* console.log('Randomly Selected Movie.movie:', JSON.stringify(randomMovie.Movie, null, 2));

            if (randomMovie && randomMovie.Movie) {
                res.setHeader('Content-Type', 'application/json');
                console.log('Sending movie data:', JSON.stringify(randomMovie.Movie, null, 2));
                res.json(randomMovie.Movie);  // Send the associated Movie details
            } else {
                console.log('No associated movie details found.');
                res.status(404).json({ error: 'No associated movie details found.' });
            } */

            //res.json({ status: 'success', data: randomMovie });

            res.json(randomMovie); // Send random movie to the frontend

            //res.json(randomMovie.Movie);  // Send the associated Movie details
        } else {
            res.setHeader('Content-Type', 'application/json');
            console.log('No movies found for this user and genre.');
            res.status(404).json({ error: 'No movies found in your watchlist for this genre.' });
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        console.error('Error getting random movie:', error);
        res.status(500).json({ error: 'Server error while getting random movie.' });
    }

    /* if (!randomMovie) {
        return res.status(404).json({ error: 'No matching movies found.' });
    } */
});
// Test Randomize router
router.get('/test-randomize', (req, res) => {
    res.json({
        title: "Deadpool & Wolverine",
        year: "2024",
        genre: "Comedy",
        description: "Chris Evans was Human Torch, not Captain America."
    });
});
// Test db association
router.get('/test-associations', async (req, res) => {
    try {
        const watchlistItems = await MovieWatchlist.findAll({
            include: [{ model: Movie }],
        });
        res.json(watchlistItems);
    } catch (error) {
        console.error('Association test failed:', error);
        res.status(500).json({ error: 'Failed to test associations.' });
    }
});

module.exports = router;
