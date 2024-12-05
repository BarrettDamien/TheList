// Created this page with the idea of having a merged approach to the randomiser where users could search TV and Movies at once but it's on the backburner while I build out the rest of the app

const express = require('express')
const router = express.Router()
const { Movie, MovieWatchlist, TVShow, TVWatchlist } = require('../models')
const { Op } = require('sequelize')

router.get('/', (req, res) => {
    if (req.user) {
        res.render('randomize', { user: req.user, username: req.user.username }) // Pass user data to template
    } else {
        res.redirect('/auth/login')
    }
})

// Randomize both TV Shows and Movies
router.get('/randomize-all', async (req, res) => {
    const genre = req.query.q // Optional genre filter
    const userId = req.user ? req.user.id : null

    if (!userId) {
        console.log("User not logged in")
        return res.status(401).json({ error: 'User must be logged in to use this feature.' })
    }

    try {
        // Fetch movies from the MovieWatchlist
        const moviesInWatchlist = await MovieWatchlist.findAll({
            where: { userId },
            include: [
                {
                    model: Movie,
                    where: genre ? { genre: { [Op.like]: `%${genre}%` } } : {},
                },
            ],
        })

        // Fetch TV shows from the TVWatchlist
        const tvInWatchlist = await TVWatchlist.findAll({
            where: { userId },
            include: [
                {
                    model: TVShow,
                    where: genre ? { genre: { [Op.like]: `%${genre}%` } } : {},
                },
            ],
        })

        console.log('Movies in Watchlist:', JSON.stringify(moviesInWatchlist, null, 2))
        console.log('TV Shows in Watchlist:', JSON.stringify(tvInWatchlist, null, 2))

        // Combine results from both watchlists
        const combinedWatchlist = [
            ...moviesInWatchlist.map((entry) => ({
                type: 'movie',
                data: entry.Movie,
            })),
            ...tvInWatchlist.map((entry) => ({
                type: 'tv',
                data: entry.TVShow,
            })),
        ]

        // Check if the combined watchlist is empty
        if (combinedWatchlist.length === 0) {
            console.log('No items found for this user and genre.')
            return res.status(404).json({ error: 'No items found in your watchlist for this genre.' })
        }

        // Pick a random item from the combined list
        const randomItem = combinedWatchlist[Math.floor(Math.random() * combinedWatchlist.length)]

        console.log('Randomly Selected Item:', JSON.stringify(randomItem, null, 2))

        // Respond with the random item
        res.json(randomItem)
    } catch (error) {
        console.error('Error fetching random item:', error)
        res.status(500).json({ error: 'Server error while fetching random item.' })
    }
})

module.exports = router