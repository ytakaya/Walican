const router = require("express").Router();
const url = require('url');
const uuid = require('uuid/v1');

const pay = require('../src/pay/index');
const db_logics = require('../src/utils/dbs/logics');
const rate = require('../src/utils/rate/index');
const date = require('../src/utils/date');

router.get("/", (req, res) => {
  const groupId = url.parse(req.url, true).query.groupId;
  if (!url.parse(req.url, true).query.payId) {
    const parent = req.user.id;
    const payId = uuid();
    db_logics.getUsersByGroupId(groupId).then(value => {
      const doc = {
        payId: payId,
        groupId: groupId,
        users: value.users,
        parent: parent,
        newData: 'yes',
      }
      res.render("./borrow.ejs", doc);
    })
  }
  else {
    const payId = url.parse(req.url, true).query.payId;
    db_logics.getUserIdByPayId(payId).then((payment) => {
      const {parent, user_ids, payment_status} = payment;
      if (payment_status === 'pending') {
        db_logics.getUsersByUserIds(user_ids).then((users) => {
          const doc = {
            payId: payId,
            groupId: groupId,
            users: users,
            parent: parent,
            newData: 'no',
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
  }
});

router.post("/regist", (req, res) => {
  //エラーのリダイレクト処理いれる, 選択されてなかったらエラー
  const group_id = req.body.groupId;
  const parent = req.body.parent;
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

    const query = {
      payments_id: req.body.payId,
      propose: req.body.propose || '---',
      group_id: group_id,
      parent: parent,
      children: children, 
      method: 'borrow', 
      amount: jpy, 
      status: "auth_pending"
    }
    if (req.body.newData == 'yes')
      query.date = date.getDate()

    db_logics.updatePayments(query);
    db_logics.insertWaitings([{payments_id: req.body.payId, group_id: group_id, user: target_user}]);
    db_logics.getUsersByUserIds([target_user]).then((users) => {
      const user_names = [];
      users.forEach(user => {
        user_names.push(user.name);
      })
      pay.authBubble(req.body.payId, data, req.body.propose, group_id, user_names, parent, 'borrow');
      console.log("ok")
      res.redirect("/complete/success");
    })
  })
})

module.exports = router;