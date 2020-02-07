const router = require("express").Router();

router.get("/success/", (req, res) => {
  const docs = {
    status: "success",
    message: "認証メッセージを送信しました"
  }
  res.render("./complete.ejs", docs);
});

router.get("/alreadyAuth/", (req, res) => {
  const docs = {
    status: "alreadyAuth",
    message: "認証が完了しました"
  }
  res.render("./complete.ejs", docs);
});

module.exports = router;