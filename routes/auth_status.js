const router = require("express").Router();
const url = require('url');

const db_logics = require('../src/utils/dbs/logics');


router.get("/", (req, res) => {
  const payId = url.parse(req.url, true).query.payId;
  db_logics.getChildrenByPayId(payId).then((children) => {
    let yetAuth = false;
    Object.keys(children).forEach(userId => {
      if (!children[userId])
        yetAuth = true;
    })
    if (yetAuth) {
      // 認証経過ページの表示
      res.send(200)
    }
    else
      res.redirect("/complete/alreadyAuth");
  })
});

module.exports = router;