require('dotenv').config;
const router = require("express").Router();
const url = require('url');
const request = require('request');
const { authenticate } = require("../lib/security/accountcontrol");

// const db_logics = require('../src/utils/dbs/logics');
const CHANNEL_ID = process.env.CHANNEL_ID;
const CHANNEL_SECRET = process.env.CHANNEL_SECRET;
const Callback_URL = `${process.env.HOST_URL}/oauth/getToken`;
const State = 'falehigiao3';
const oauth_url = `https://access.line.me/dialog/oauth/weblogin?response_type=code&client_id=${CHANNEL_ID}&redirect_uri=${Callback_URL}&state=${State}`


router.get("/", (req, res) => {
  res.redirect(oauth_url)
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
    if (err) console.log(err);
    else {
      console.log(res2);
      const q2 = {
        uri: 'https://api.line.me/v2/profile',
        headers: {'Authorization': `Bearer ${res2.access_token}`}
      }
      request.get(q2, (err, req3, res3) => {
        if (err) console.log(err);
        else {
          const docs = JSON.parse(res3)
          console.log(docs)
          res1.render('./login.ejs', docs);
        }
      })
    }
  });
})

module.exports = router;