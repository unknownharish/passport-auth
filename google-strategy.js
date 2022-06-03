const { model } = require('./schema/schema');
require('dotenv').config({ path: './config.env' })



const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET


passport.serializeUser((user, done) => {

    console.log('in serialize')
    console.log(user)
    done(false, user.id)

})
passport.deserializeUser((id, done) => {

    model.findById(id, (err, user) => {
        // console.log('in deserialize')

        if (!user) return done(false, false)
        else return done(false, user)

    })


})

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/google/callback"
    },
    async function(accessToken, refreshToken, profile, next) {



        console.log('profile is : ', profile._json)


        try {

            model.findOne({ email: profile._json.email }, (err, user) => {

                if (!user) model.create({ email: profile._json.email, name: profile._json.name }, (err, user) => next(false, user))
                if (user) return next(false, user)

            })



        } catch (error) {

            console.log(error)
            return next(false, null)
        }
    }));

exports.passport = passport