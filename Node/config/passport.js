var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
// For Admin
// const Admin = require('../models/admin');
// For User
// const User = require('../models/user');
const config = require('../config/database');

module.exports = function (passport) {
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
opts.secretOrKey = config.secret;
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

    // Getting User
    User.getUserById(jwt_payload.data._id, (err, user) => {
        if (err) {
            return done(err, false);
            // Check if Admin
            //Getting Admin
            Admin.getUserById(jwt_payload.data._id, (err, admin) => {
                if (err) {
                    return done(err, false);
                }
                if (admin) {
                    return done(null, admin);
                } else {
                    return done(null, false);
                }
            });
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });


}));
}