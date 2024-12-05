const express = require('express')
const router = express.Router()
const { TVWatchlist, TVShow } = require('../models')
const { Op } = require('sequelize') //sequelize operator


router.get('/', (req, res) => {
    if (req.user) {
        res.render('randomize', { user: req.user, username: req.user.username }) // Pass user ID to the template
    } else {
        res.redirect('/auth/login')
    }
})

// Randomize TV Shows
router.get('/randomize-tv', async (req, res) => {
    const genre = req.query.q
    const userId = req.user ? req.user.id : null

    if (!userId) {
        console.log("User not logged in")
        return res.status(401).json({ error: 'User must be logged in to use this feature.' })
    }

    try {
        // Query user's tv show watchlist
        const tvInWatchlist = await TVWatchlist.findAll({
            where: { userId },
            include: [
                {
                    model: TVShow,
                    where: genre
                        ? { genre: { [Op.like]: `%${genre}%` } }
                        : {},  // Optional genre filter
                },
            ],
        })

        console.log('TV Shows in Watchlist:', JSON.stringify(tvInWatchlist, null, 2))

        if (tvInWatchlist.length > 0) {
            // Pick a random TV show from the watchlist
            const randomTVShow = tvInWatchlist[Math.floor(Math.random() * tvInWatchlist.length)]

            console.log('Randomly Selected TV Show:', JSON.stringify(randomTVShow, null, 2))

            res.json(randomTVShow) // Send random TV show to the frontend
        } else {
            res.setHeader('Content-Type', 'application/json')
            console.log('No shows found for this user and genre.')
            res.status(404).json({ error: 'No TV shows found for this genre' })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        console.error('Error getting random TV show:', error)
        res.status(500).json({ error: 'Server error while getting random TV show' })
    }
})

module.exports = router
