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
      res.render("./borrow.ejs", doc);
    })
  })
});

router.post("/regist", (req, res) => {
  //エラーのリダイレクト処理いれる, 選択されてなかったらエラー
  const target_user = req.body.target_user;
  db_logics.updatePayments(req.body.payId, {children: {target_user: false}, method: 'borrow', amount: req.body.amount, status: "auth_pending"});
  db_logics.getGroupIdAndParentByPayId(req.body.payId).then((response) => {
    db_logics.getUsersByUserIds([target_user]).then((users) => {
      const user_names = [];
      users.forEach(user => {
        user_names.push(user.name);
      })
      pay.authBubble(req.body.payId, req.body.amount, req.body.propose, response.group_id, user_names, response.parent);
      console.log("ok")
      res.render("./complete.ejs", {message: "認証メッセージを送信しました"});
    })
  })
})

module.exports = router;