const router = require("express").Router();
const url = require('url');

const pay = require('../src/pay/index');
const db_logics = require('../src/utils/dbs/logics');
const rate = require('../src/utils/rate/index');

router.get("/", (req, res) => {
  const payId = url.parse(req.url, true).query.payId;
  db_logics.getUserIdByPayId(payId).then((payment) => {
    const {parent, user_ids, payment_status} = payment;
    if (payment_status === 'pending') {
      db_logics.getUsersByUserIds(user_ids).then((users) => {
        const doc = {
          payId: payId,
          users: users,
          parent: parent,
        }
        res.render("./borrow.ejs", doc);
      })
    }
    else if (payment_status === 'canceled') {
      res.redirect("/complete/canceledAuth");
    }
    else {
      res.redirect("/complete/alreadySendAuth");
    }
  })
});

router.post("/regist", (req, res) => {
  //エラーのリダイレクト処理いれる, 選択されてなかったらエラー
  const target_user = req.body.target_user;
  let children = {};
  children[target_user] = false;

  rate.currencyConvert(req.body.amount, req.body.currency).then(converted_amount => {
    const jpy = Math.round(converted_amount);
    const data = {
      currency: req.body.currency,
      original: req.body.amount,
      jpy: jpy
    };

    db_logics.updatePayments(req.body.payId, {children: children, method: 'borrow', amount: jpy, status: "auth_pending"});
    db_logics.getGroupIdAndParentByPayId(req.body.payId).then((response) => {
      db_logics.getUsersByUserIds([target_user]).then((users) => {
        const user_names = [];
        users.forEach(user => {
          user_names.push(user.name);
        })
        pay.authBubble(req.body.payId, data, req.body.propose, response.group_id, user_names, response.parent, 'borrow');
        console.log("ok")
        res.redirect("/complete/success");
      })
    })
  })
})

module.exports = router;