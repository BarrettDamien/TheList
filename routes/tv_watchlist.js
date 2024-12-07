const express = require('express')
const axios = require('axios')
const router = express.Router()
const { TVShow, TVWatchlist } = require('../models')
const OMDB_KEY = process.env.OMDB_API_KEY

// Main home page login reset page
router.get('/', (req, res) => {
    if (req.user) {
        res.render('watchlist', { user: req.user, username: req.user.username }) // Pass user ID to the template
    } else {
        res.redirect('/auth/login')
    }
})

// Search OMDB via GET API endpoints and search for TV shows
router.get('/search', async (req, res) => {
    const { q: searchQuery, page = 1 } = req.query

    console.log('OMDB_KEY:', process.env.OMDB_API_KEY)

    if (!/^[a-zA-Z0-9\s]+$/.test(searchQuery)) {
        return res.status(400).json({ error: 'Invalid search query.' })
    }

    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' })
    }

    try {
        const response = await axios.get(`http://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&type=series&apikey=${OMDB_KEY}&page=${page}`)

        if (response.data.Response === 'True') {
            const tvShows = await Promise.all(response.data.Search.map(async (tv) => {
                const tvDetailsResponse = await axios.get(`http://www.omdbapi.com/?i=${tv.imdbID}&apikey=${OMDB_KEY}`);
                const tvDetails = tvDetailsResponse.data;
                return {
                    Title: tvDetails.Title,
                    Year: tvDetails.Year,
                    imdbID: tv.imdbID,
                    Poster: tvDetails.Poster,
                    Plot: tvDetails.Plot,
                    Genre: tvDetails.Genre,
                };
            }));
            res.json({
                results: tvShows,
                totalResults: parseInt(response.data.totalResults, 10) || 0,
                currentPage: parseInt(page, 10),
            })
        } else {
            res.status(404).json({ error: response.data.Error })
        }
    } catch (error) {
        console.error('Error searching for TV shows:', error)
        res.status(500).json({ error: 'Server error occurred while searching for TV shows' })
    }
})

// Add a TV show to the watchlist
router.post('/add-to-watchlist', async (req, res) => {
    const { imdbID } = req.body

    // Ensure user is logged in safety net
    if (!req.user) {
        return res.status(401).json({ error: 'User must be logged in to add to watchlist' })
    }

    const userId = req.user.id

    try {
        const tvResponse = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&type=series&apikey=${OMDB_KEY}`)

        if (tvResponse.data.Response === 'True') {
            const tvData = tvResponse.data

            // Find or create TV show in the TV table
            const [tvRecord, created] = await TVShow.findOrCreate({
                where: { imdbID: tvData.imdbID },
                defaults: {
                    title: tvData.Title,
                    year: tvData.Year,
                    genre: tvData.Genre,
                    seasons: tvData.totalSeasons,
                    type: tvData.Type,
                    poster: tvData.Poster,
                    plot: tvData.Plot,
                    // Add other fields as necessary
                }
            })

            console.log('Inserting into TVWatchlist:', { userId, tvShowId: tvRecord.id })

            // Check if already in watchlist
            const existingEntry = await TVWatchlist.findOne({
                where: { userId: userId, tvShowId: tvRecord.id }
            })

            if (existingEntry) {
                return res.status(409).json({ error: 'TV show already in watchlist' })
            }

            // Add to watchlist
            await TVWatchlist.create({
                userId: userId,
                tvShowId: tvRecord.id,
            })

            res.status(201).json({ message: '/routes/tv_watchlist.js - TV show added to watchlist', tv: tvRecord })
        } else {
            res.status(404).json({ error: '/routes/tv_watchlist.js - TV show not found' })
        }
    } catch (error) {
        console.error('Error adding TV show to watchlist:', error)
        res.status(500).json({ error: '/routes/tv_watchlist.js - 500 error' })
    }
})

module.exports = router
