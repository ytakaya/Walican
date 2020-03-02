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
      req.session.regenerate(err => {
        done(null, username);
      });
      console.log("login success");
    } else {
      done(null, false, req.flash("message", "認証に失敗しました。"))
      console.log("login failed");
    }
  })
);

const initialize = function() {
  return [
    passport.initialize(),
    passport.session(),
    function (req, res, next) {
      if (req.user) {
        res.locals.user = req.user;
      }
      next();
    },
  ];
};

const authenticate = function() {
  return passport.authenticate(
    "local-strategy", {
      successRedirect: "/account/user",
      failureRedirect: "/failed",
    }
  )
}

const authorize = function() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/oauth");
    }
  }
}

module.exports = {
  initialize,
  authenticate,
  authorize
};