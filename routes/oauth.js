require('dotenv').config;
const router = require("express").Router();
const url = require('url');

// const db_logics = require('../src/utils/dbs/logics');
const CHANNEL_ID = process.env.CHANNEL_ID;
const Callback_URL = `${process.env.HOST_URL}/oauth/complete`;
const State = 'falehigiao3';
const oauth_url = `https://access.line.me/dialog/oauth/weblogin?response_type=code&client_id=${CHANNEL_ID}&redirect_uri=${Callback_URL}&state=${State}`


router.get("/", (req, res) => {
  res.redirect(oauth_url)
});

router.get("/complete", (req, res) => {
  const accessToken = url.parse(req.url, true).query.code;
  console.log(accessToken)
  res.send(200)
})

module.exports = router;

