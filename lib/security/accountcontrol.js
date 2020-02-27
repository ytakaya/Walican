const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const db_logics = require('../..//src/utils/dbs/logics');

passport.serializeUser((userid, done) => {
  done(null, userid);
});

passport.deserializeUser((userid, done) => {
  db_logics.getUserByUserId(userid).then(user => {
    done(null, user);
  }).catch(err => {
    done(err);
  })
})

passport.use("local-strategy",
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
  },
  (req, username, password, done) => {
    if (username) {
      // req.session.regenerate(err => {
        done(null, username);
      // });
      console.log("login success");
    } else {
      done(null, false)
      console.log("login failed");
    }
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
      failureRedirect: "/failed",
    }
  )
}

module.exports = {
  initialize,
  authenticate,
  // authorize
};