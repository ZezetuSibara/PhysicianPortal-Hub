const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');

const initialize = (passport) => {
    const authenticateUser = async (practice_id, password, done) => {
        const user = getUserByPractice_id(practice_id);
        if (user == null) {
            return done(null, false, {message: 'no user found'})
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incoreect' })
            }
        } catch (e) {
            return done(e);
        }
    }

    passport.use(new LocalStrategy({ usernameField: practice_id}), authenticateUser);
    passport.serializeUser((user, done) => {});
    passport.deserializeUser((user, done) => {});
};

module.exports = initialize;