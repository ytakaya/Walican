const router = require("express").Router();
const url = require('url');

router.get("/", (req, res) => {
  const payId = url.parse(req.url, true).query.payId;
  const doc = {
    payId: payId,
  }
  res.render("../views/dutch.ejs", doc);
});

module.exports = router;