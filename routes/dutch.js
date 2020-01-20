const {CONNECTION_URL, OPTIONS, DATABASE} = require("../config/mongodb.config.js");
const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const url = require('url');

router.get("/", (req, res) => {
  const payId = url.parse(req.url, true).query.payId;
  const doc = {
    payId: payId,
  }
  res.render("../views/dutch.ejs", doc);
});

module.exports = router;