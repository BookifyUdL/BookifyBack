var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Admin = require('../models/admin');
const Admins = mongoose.model('Admin');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    Admins.findOne({ email })
        .then((user) => {
            if(!user || !user.validatePassword(password)) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
            }

            return done(null, user);
        }).catch(done);
}));

