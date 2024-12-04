var express = require('express')
var crypto = require('crypto')
var passport = require('passport')
var LocalStrategy = require('passport-local')
const sequelize = require('../database')
const { User } = require('../database')
const { body, validationResult } = require('express-validator')

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

router.post(
    '/login',
    [
        body('username').trim().escape().isAlphanumeric().withMessage('Invalid username.'),
        body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login?failed=1',
    })
);

router.get('/login', (req, res, next) => {
    const failed = req.query.failed
    res.render('login', {failed: failed})
})

router.post(
    '/signup',
    [
        body('username')
            .trim()
            .escape()
            .isAlphanumeric()
            .withMessage('Username must only contain letters and numbers.')
            .custom(async (value) => {
                const user = await User.findOne({ where: { username: value } });
                if (user) {
                    throw new Error('Username already taken.');
                }
                return true;
            }),
        body('password')
            .trim()
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long.'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error) => error.msg);
            return res.render('signup', { failed: true, msg: errorMessages.join(' ') });
        }

        let salt = crypto.randomBytes(16).toString('hex');
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            if (err) {
                console.error('Hashing error:', err);
                return res.redirect('/auth/signup?failed=1');
            }
            try {
                const user = await User.create({
                    username: req.body.username,
                    password: hashedPassword.toString('hex'),
                    salt: salt,
                });

                req.login(user, function (err) {
                    if (err) {
                        console.error('Login error:', err);
                        return res.redirect('/auth/signup?failed=3');
                    }
                    res.redirect('/');
                });
            } catch (e) {
                console.error('Error creating user:', e);
                return res.redirect('/auth/signup?failed=1');
            }
        });
    }
);


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