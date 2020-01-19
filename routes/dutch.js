const router = require("express").Router();
const url = require('url');

router.get("/", (req, res) => {
  const payId = url.parse(req.url, true).query.payId;
  res.send("ok")
});

module.exports = router;