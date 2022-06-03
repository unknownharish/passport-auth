const express = require('express')
const app = express()
require('dotenv').config({ path: './config.env' })
const session = require('express-session')
const res = require('express/lib/response')
const { passport } = require('./google-strategy')
const { connect } = require('./schema/connect')


connect()


app.use(express.json());
app.use(session({

    secret: 'hello checking session',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 } // 1 min



}))


app.use(passport.initialize()); // add ons  !important
app.use(passport.session())


app.get('/api/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/google/callback',
    passport.authenticate('google', { failureRedirect: '/fail' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dash');
    });

function isAuth(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.send('unauthorized access...!')
    }
}

app.get('/', (req, res) => res.send('hello llogin page'))
app.get('/dash', isAuth, (req, res, next) => res.send('you are welcome a valid user ..!' + req.user.name))
app.get('/fail', (req, res, next) => res.send('you faild to login ...!'))
app.get('/logout', (req, res) => req.logout(err => !err ? res.redirect('/') : res.send('error', err)))

app.listen(process.env.PORT, () => {
    console.log('server is running ', process.env.PORT)
})