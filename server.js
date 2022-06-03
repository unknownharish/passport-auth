const express = require('express')
const app = express()
require('dotenv').config({ path: './config.env' })
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

const { connect } = require('./schema/connect')

const { model } = require('./schema/schema');

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

passport.use(new LocalStrategy( // it is passport middleware
    function(email, password, done) {

        console.log(email, password)

        model.findOne({ email }, function(err, user) {

            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'incorrect username' }); }
            if (!user.password === password) { return done(null, false, { message: 'incorrect password' }); }
            return done(null, user); //pass it to next middleware if exist 1 arg = error 
        });
    }
));



passport.serializeUser((user, next) => {

    if (user) {
        console.log(user.id)
        return next(null, user.id)
    } else { return next(null, false) }

});
passport.deserializeUser((id, next) => {


    model.findById(
        id, (err, user) => {
            if (err)
                return next(null, false)
            else
                return next(null, user)
        })

})


function auth(req, res, next) {
    console.log(req.user)
    req.user ? next() : res.redirect('/')
}

app.post('/login',
    passport.authenticate("local", { failureRedirect: "/" }),
    function(req, res) {
        res.redirect('/dashboard');
    });

app.get('/', (req, res) => {
    res.send('login page')
})

app.get('/dashboard', auth, (req, res) => {
    res.send('login success')
})

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('logout success')
})

app.listen(5000, () => {
    console.log('server is running ', 5000)
})