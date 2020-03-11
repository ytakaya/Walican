require('dotenv').config;
const router = require("express").Router();
const url = require('url');
const request = require('request');
const { authenticate } = require("../../lib/security/accountcontrol");

const db_logics = require('../../src/utils/dbs/logics');
const CHANNEL_ID = process.env.CHANNEL_ID;
const CHANNEL_SECRET = process.env.CHANNEL_SECRET;
const Callback_URL = `${process.env.HOST_URL}/oauth/getToken`;
const State = Math.random().toString(32).substring(2);
const oauth_url = `https://access.line.me/dialog/oauth/weblogin?response_type=code&client_id=${CHANNEL_ID}&redirect_uri=${Callback_URL}&state=${State}`


router.get("/", (req, res) => {
  const docs = {
    url: oauth_url,
    message: req.flash("message")
  }
  res.render("./account/oauth/login.ejs", docs)
});

router.get("/getToken", (req1, res1) => {
  const q1 = {
    uri: 'https://api.line.me/v2/oauth/accessToken',
    headers: {'Content-type': 'application/x-www-form-urlencoded'},
    qs: {
      grant_type: 'authorization_code',
      code: url.parse(req1.url, true).query.code,
      client_id: CHANNEL_ID,
      client_secret: CHANNEL_SECRET,
      redirect_uri: `${process.env.HOST_URL}/oauth/getToken`
    },
    json: true
  };
  request.post(q1, (err, req2, res2) => {
    console.log(res2.access_token)
    if (err) console.log(err);
    else {
      const q2 = {
        uri: 'https://api.line.me/v2/profile',
        headers: {'Authorization': `Bearer ${res2.access_token}`}
      }
      request.get(q2, (err, req3, res3) => {
        if (err) console.log(err);
        else {
          const docs = JSON.parse(res3);
          db_logics.updateUser({
            user_id: docs.userId,
            user_name: docs.displayName,
            img: docs.pictureUrl,
          });
          res1.render('./account/oauth/login-confirm.ejs', docs);
        }
      })
    }
  });
})

router.post("/login", authenticate());

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/oauth");
});

module.exports = router;