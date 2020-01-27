const router = require("express").Router();
const url = require('url');

const pay = require('../src/pay/index');
const db_logics = require('../src/utils/dbs/logics');


router.get("/", (req, res) => {
  const payId = url.parse(req.url, true).query.payId;
  db_logics.getUserIdByPayId(payId).then((payment) => {
    //parentと押した人が違う場合の処理をいれる
    const {parent, user_ids} = payment;
    db_logics.getUsersByUserIds(user_ids).then((users) => {
      const doc = {
        payId: payId,
        users: users,
        parent: parent,
      }
      res.render("../views/dutch.ejs", doc);
    })
  })
});

router.post("/regist", (req, res) => {
  //エラーのリダイレクト処理いれる
  const children = {}
  req.body.target_users.forEach(target_user => {
    children[target_user] = false;
  })
  db_logics.updatePayments(req.body.payId, children, req.body.amount);
  db_logics.getGroupIdByPayId(req.body.payId).then((group_id) => {
    db_logics.getUsersByUserIds(Object.keys(children)).then((users) => {
      const user_names = [];
      users.forEach(user => {
        user_names.push(user.name);
      })
      pay.authBubble(req.body.payId, req.body.amount, group_id, user_names);
      console.log("ok")
      res.render("../views/complete.ejs", {message: "認証メッセージを送信しました"});
    })
  })
})

module.exports = router;