const router = require("express").Router();
const url = require('url');

const db_logics = require('../src/utils/dbs/logics');


router.get("/", (req, res) => {
  const payId = url.parse(req.url, true).query.payId;
  db_logics.getChildrenByPayId(payId).then((children) => {
    if (Object.keys(children).length == 0) {
      res.redirect("/complete/yetRegist");
    }
    else {
      let yetAuth = false;
      Object.keys(children).forEach(userId => {
        if (!children[userId])
          yetAuth = true;
      })
      if (yetAuth) {
        // 認証経過ページの表示
        db_logics.getUsersByUserIds(Object.keys(children)).then(users => {
          const children_info = [];
          users.forEach(user => {
            children_info.push({
              name: user.name,
              img: user.img,
              auth: children[user.id],
            })
          })
          const doc = {
            children: children_info,
          }
          res.render("./auth_status.ejs", doc);
        })
      }
      else
        res.redirect("/complete/alreadyAuth");
    }
  })
});

module.exports = router;