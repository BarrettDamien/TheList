const express = require('express');
const axios = require('axios');
const router = express.Router();
const { sequelize, User, MovieWatchlist, Movie } = require('../models');

// Randomize TV Shows
router.get('/randomize-tv', async (req, res) => {
    const genre = req.query.q;

    if (!genre) {
        return res.status(400).json({ error: 'Genre is required' });
    }

    try {
        // Query TV shows based on genre
        const tvShows = await TVShow.findAll({
            where: {
                genre: {
                    [Op.like]: `%${genre}%`, // Case-insensitive partial match
                },
            },
        });

        if (tvShows.length > 0) {
            // Pick a random TV show from the filtered list
            const randomTVShow = tvShows[Math.floor(Math.random() * tvShows.length)];
            res.json(randomTVShow); // Send random TV show to the frontend
        } else {
            res.status(404).json({ error: 'No TV shows found for this genre' });
        }
    } catch (error) {
        console.error('Error getting random TV show:', error);
        res.status(500).json({ error: 'Server error while getting random TV show' });
    }
});

module.exports = router;
