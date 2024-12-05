const express = require('express')
const axios = require('axios')
const router = express.Router()
const { MovieWatchlist, Movie, User, TVWatchlist, TVShow } = require('../models')
const OMDB_KEY = process.env.OMDB_API_KEY

// Main home page login reset page
router.get('/', (req, res) => {
    if (req.user) {
        res.render('watchlist', { user: req.user, username: req.user.username }) // Pass user ID to the template
    } else {
        res.redirect('/auth/login')
    }
})

// Search OMDB via GET API endpoints and search for Movies
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
        const response = await axios.get(
            `http://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&type=movie&apikey=${OMDB_KEY}&page=${page}`
        )

        if (response.data.Response === 'True') {
            const movies = response.data.Search.map((movie) => ({
                Title: movie.Title || movie.title,
                Year: movie.Year || movie.year,
                imdbID: movie.imdbID,
                Poster: movie.Poster || movie.poster,
                Plot: movie.Plot || movie.plot,
            }))

            res.json({
                results: movies,
                totalResults: parseInt(response.data.totalResults, 10) || 0,
                currentPage: parseInt(page, 10),
            })
        } else {
            res.status(404).json({ error: response.data.Error })
        }
    } catch (error) {
        console.error('Error searching for movies:', error)
        res.status(500).json({ error: 'An error occurred while searching' })
    }
})

// From the GET request, POST request to add to watchlist directly
router.post('/add-to-watchlist', async (req, res) => {
    const { imdbID } = req.body

    // Ensure user is logged in safety net
    if (!req.user) {
        return res.status(401).json({ error: 'User must be logged in to add to watchlist' })
    }

    const userId = req.user.id

    try {
        // Fetch movie data from OMDb API based on the imdbID
        const movieResponse = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&type=movie&apikey=${OMDB_KEY}`)

        if (movieResponse.data.Response === 'True') {
            const movieData = movieResponse.data

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
                    plot: movieData.Plot,
                    // Add other fields
                }
            })

            console.log('Inserting into MovieWatchlist:', { userId, movieId: movieRecord.id })

            // Check for existing entry before creating
            const existingEntry = await MovieWatchlist.findOne({
                where: { userId: userId, movieId: movieRecord.id }
            })

            if (existingEntry) {
                return res.status(409).json({ error: 'Movie already in watchlist' })
            }

            // Add the movie to the user's watchlist
            await MovieWatchlist.create({
                userId: userId,
                movieId: movieRecord.id,
            })

            return res.status(201).json({ message: '/routes/watchlist.js - Movie added to watchlist', movie: movieRecord })
        } else {
            return res.status(404).json({ error: '/routes/watchlist.js - Movie not found' })
        }
    } catch (error) {
        console.error('Error adding Movie to watchlist:', error)
        return res.status(500).json({ error: '/routes/watchlist.js - 500 error' })
    }
})

// Adding a watchlist viewer function
// Get the user's watchlist
router.get('/viewer', async (req, res) => {
    try {
        const user = req.user // Assuming the user is authenticated
        if (!user) {
            return res.redirect('/auth/login') // Redirect to login if not authenticated
        }

        const username = user.username

        // Fetch the user's movie and TV show watchlists
        const movies = await MovieWatchlist.findAll({
            where: { userId: user.id },
            include: [{ model: Movie, attributes: ['id', 'title', 'year', 'imdbID', 'poster'] }],
            raw: true,
        })
        console.log(movies)

        const tvShows = await TVWatchlist.findAll({
            where: { userId: user.id },
            include: [{ model: TVShow, attributes: ['id', 'title', 'year', 'imdbID', 'poster'] }],
            raw: true,
        })
        console.log(tvShows)

        // Extract movie and TV show data
        const movieData = movies.map(item => ({
            title: item['movie.title'],  // Accessing flattened field
            year: item['movie.year'],
            poster: item['movie.poster'],
            id: item['movie.id']
        }))

        const tvShowData = tvShows.map(item => ({
            title: item['tvshow.title'],  // Accessing flattened field
            year: item['tvshow.year'],
            poster: item['tvshow.poster'],
            id: item['tvshow.id']
        }))

        console.log("Mapped movieData: ", movieData)
        console.log("Mapped tvShowData: ", tvShowData)

        res.render('viewer', { movies: movieData, tvShows: tvShowData, username: username, })
    } catch (error) {
        console.error("Error fetching watchlist:", error)
        res.status(500).send('Internal Server Error')
    }
})

// Adding watchlist removal option
router.post('/remove', async (req, res) => {
    console.log('Request to remove from watchlist:', req.body)
    const { itemId, type } = req.body

    if (!itemId || !type) {
        return res.status(400).json({ error: 'itemId or type is missing' })
    }

    const user = req.user // Assuming authentication middleware
    if (!user) {
        return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
        if (type === 'movie') {
            const deleted = await MovieWatchlist.destroy({
                where: { movieId: itemId, userId: user.id },
            })
            if (deleted) {
                return res.status(200).json({ message: 'Movie removed from watchlist' })
            } else {
                return res.status(404).json({ error: 'Movie not found in watchlist' })
            }
        } else if (type === 'tv') {
            const deleted = await TVWatchlist.destroy({
                where: { tvShowId: itemId, userId: user.id },
            })
            if (deleted) {
                return res.status(200).json({ message: 'TV show removed from watchlist' })
            } else {
                return res.status(404).json({ error: 'TV show not found in watchlist' })
            }
        } else {
            return res.status(400).json({ error: 'Invalid type' })
        }
    } catch (error) {
        console.error('Error during removal:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


module.exports = router
