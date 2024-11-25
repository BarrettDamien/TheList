var express = require('express')
var crypto = require('crypto')
var passport = require('passport')
var LocalStrategy = require('passport-local')
const sequelize = require('../database')
const { User } = require('../database')

var router = express.Router();

passport.use(new LocalStrategy(async function verify(username, password, done) {
    try {
        const user = await User.findOne({where: {username: username}})
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password'})
        }

        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
            if (err) {
                return done(err)
            }

            if (!crypto.timingSafeEqual(Buffer.from(user.password, 'hex'), hashedPassword)) {
                return done(null, false, { message: 'Incorrect username or password'})
            }

            return done(null, user)
        })

    } catch (e) {
        return done(e);
    }
}))

passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.deserializeUser(function(id,done) {
    User.findByPk(id).then(function(user) {
        done(null, user)
    })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/watchlist',
    failureRedirect: '/auth/login?failed=1'
}))

router.get('/login', (req, res, next) => {
    const failed = req.query.failed
    res.render('login', {failed: failed})
})

router.post('/signup', (req, res, next) => {
    let salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
        if(err) {
            console.error("Hashing error:", err);
            res.redirect('/auth/signup?failed=1')
        }
        try {
            const user = await User.create({
                username: req.body.username,
                password: hashedPassword.toString('hex'),
                salt: salt
            })

            req.login(user, function(err) {
                if (err) {
                    console.error("Login error:", err);
                    res.redirect('/auth/signup?failed=3')
                }
                res.redirect('/')
            })
        } catch (e) {
            console.error("Error creating user:", e);
            if (e.name === 'SequelizeUniqueConstraintError') {
                res.redirect('/auth/signup?failed=2'); // Username taken
            } else {
                res.redirect('/auth/signup?failed=1'); // Other error
            }
        }
    })
})

router.get('/signup', (req, res, next) => {
    const failed = req.query.failed

    let msg = ''
    switch (failed) {
        case '1':
            msg = 'Oops, something went wrong on our end.'
            break;
        case '2':
            msg = 'Username taken.'
            break;
        case '3':
            msg = 'Failed to login.'
            break;
    }

    res.render('signup',{failed:failed,msg:msg})
})

router.post('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
})

module.exports = router;