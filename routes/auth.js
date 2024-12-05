var express = require('express')
var crypto = require('crypto')
var passport = require('passport')
var LocalStrategy = require('passport-local')
const sequelize = require('../database')
const { User } = require('../database')
const { body, validationResult } = require('express-validator')

var router = express.Router()

// Passport LocalStrategy for authenticating users
passport.use(new LocalStrategy(async function verify(username, password, done) {
    try {
        // Find user by username
        const user = await User.findOne({ where: { username: username } })
        if (!user) {
            // If no user is found, authentication fails
            return done(null, false, { message: 'Incorrect username or password' })
        }

        // Hash the provided password and compare with stored password hash
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            if (err) {
                return done(err)
            }
            // Use timingSafeEqual to prevent timing attacks during password comparison
            if (!crypto.timingSafeEqual(Buffer.from(user.password, 'hex'), hashedPassword)) {
                return done(null, false, { message: 'Incorrect username or password' })
            }

            // Authentication successful, pass user to done
            return done(null, user)
        })

    } catch (e) {
        return done(e)
    }
}))

// Serialize user data into session (stores user id)
passport.serializeUser(function (user, done) {
    done(null, user.id)
})

// Deserialize user data from session (retrieves full user object using id)
passport.deserializeUser(function (id, done) {
    User.findByPk(id).then(function (user) {
        done(null, user)
    })
})

// POST route for user login
router.post('/login', [
    // Validate and sanitize username and password
    body('username').trim().escape().isAlphanumeric().withMessage('Invalid username.'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
},
    passport.authenticate('local', {
        successRedirect: '/', // Redirect to homepage on successful login
        failureRedirect: '/auth/login?failed=1', // Render login page with failure message if applicable
    })
)

// GET route to render login page
router.get('/login', (req, res, next) => {
    const failed = req.query.failed // Get query parameter indicating failed login
    res.render('login', { failed: failed }) // Render login page with failure message if applicable
})

// POST route for user signup
router.post('/signup', [
    // Validate and sanitize username and password
    body('username')
        .trim()
        .escape()
        .isAlphanumeric()
        .withMessage('Username must only contain letters and numbers.')
        .custom(async (value) => {
            const user = await User.findOne({ where: { username: value } })
            if (user) {
                throw new Error('Username already taken.')
            }
            return true
        }),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),
],
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error) => error.msg)
            return res.render('signup', { failed: true, msg: errorMessages.join(' ') })
        }

        // Generate a salt and hash the password using pbkdf2
        let salt = crypto.randomBytes(16).toString('hex')
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            if (err) {
                console.error('Hashing error:', err)
                return res.redirect('/auth/signup?failed=1')
            }
            try {
                // Create a new user in the database with the hashed password and salt
                const user = await User.create({
                    username: req.body.username,
                    password: hashedPassword.toString('hex'),
                    salt: salt,
                })

                // Log the user in immediately after account creation
                req.login(user, function (err) {
                    if (err) {
                        console.error('Login error:', err)
                        return res.redirect('/auth/signup?failed=3')
                    }
                    res.redirect('/')
                })
            } catch (e) {
                console.error('Error creating user:', e)
                return res.redirect('/auth/signup?failed=1')
            }
        })
    }
)

// GET route to render signup page
router.get('/signup', (req, res, next) => {
    const failed = req.query.failed

    let msg = ''
    // Set appropriate failure message based on the 'failed' query parameter
    switch (failed) {
        case '1':
            msg = 'Oops, something went wrong on our end.'
            break
        case '2':
            msg = 'Username taken.'
            break
        case '3':
            msg = 'Failed to login.'
            break
    }

    res.render('signup', { failed: failed, msg: msg })
})

// POST route to log the user out
router.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
})

module.exports = router