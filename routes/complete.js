const router = require("express").Router();

router.get("/success/", (req, res) => {
  const docs = {
    status: "success",
    message: "認証"
  }
  res.render("./complete.ejs", docs);
});

module.exports = router;