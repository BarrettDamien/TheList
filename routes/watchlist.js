const express = require('express');
const axios = require('axios');
const router = express.Router();
const { MovieWatchlist, Movie } = require('../models');
const OMDB_API_KEY = '144a0d98';

// Main home page login reset page
router.get('/', (req, res) => {
    if(req.user) {
        res.render('watchlist', { user: req.user  }); // Pass user ID to the template
    } else {
        res.redirect('/auth/login');
    }
});

/* router.get('/watchlist', (req, res) => {
    if(req.user) {
        res.render('watchlist', { user: req.user  }); // Pass user ID to the template
    } else {
        res.redirect('/auth/login');
    }
}); */

// Search OMDB via GET API endpoints and search for Movies
router.get('/search', async (req, res) => {
    const searchQuery = req.query.q;
    
    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' });
    }
    
    try {
        const response = await axios.get(`http://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&type=movie&apikey=${OMDB_API_KEY}`);
        
        if (response.data.Response === 'True') {
            const movies = response.data.Search.map(movie => ({
                Title: movie.Title || movie.title,
                Year: movie.Year || movie.year,
                imdbID: movie.imdbID,
                Poster: movie.Poster || movie.poster,
            }));
            res.json(movies); // Send TV show results
            //res.json(response.data.Search);  // Send search results back to client
        } else {
            res.status(404).json({ error: response.data.Error });
        }
    } catch (error) {
        console.error('Error searching for TV shows:', error);
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

    try {
        // Fetch movie data from OMDb API based on the imdbID
        const movieResponse = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&type=movie&apikey=${OMDB_API_KEY}`);

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
                    type: movieData.Type,
                    poster: movieData.Poster,
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
        console.error('Error adding Movie to watchlist:', error);
        return res.status(500).json({ error: '/routes/watchlist.js - 500 error' });
    }
});

module.exports = router;
