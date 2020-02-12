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

router.get("/yetRegist/", (req, res) => {
  const docs = {
    status: "yetRegist",
    message: "まだ登録されていない支払いです"
  }
  res.render("./complete.ejs", docs);
});

router.get("/alreadySendAuth/", (req, res) => {
  const docs = {
    status: "alreadySendAuth",
    message: "既に認証メッセージを送信しています"
  }
  res.render("./complete.ejs", docs);
});

module.exports = router;