const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;

passport.use("local-strategy",
  new LocalStrategy({}, (req, username, password, done) => {

  })
);

const initialize = function() {
  return [
    passport.initialize(),
    passport.session(),
  ];
};

const authenticate = function() {
  return passport.authenticate(
    "local-strategy", {
      successRedirect: "/",
      failureRedirect: "/",
    }
  )
}

module.exports = {
  initialize,
  authenticate,
  // authorize
};