const router = require("express").Router();
const url = require('url');

const pay = require('../src/pay/index');
const db_logics = require('../src/utils/dbs/logics');


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
        res.render("./dutch.ejs", doc);
      })
    }
    else {
      res.redirect('/complete/alreadySendAuth');
    }
  })
});

router.post("/regist", (req, res) => {
  //エラーのリダイレクト処理いれる
  db_logics.getGroupIdAndParentByPayId(req.body.payId).then((response) => {
    const children = {}
    req.body.target_users.forEach(target_user => {
      if (target_user === response.parent)
        children[target_user] = true;
      else
        children[target_user] = false;
    })
    db_logics.updatePayments(req.body.payId, {children: children, method: 'dutch', amount: req.body.amount, status: "auth_pending"});

    const user_ids = [];
    Object.keys(children).forEach(id => {
      if (id != response.parent) user_ids.push(id);
    })
    db_logics.getUsersByUserIds(user_ids).then((users) => {
      const user_names = [];
      users.forEach(user => {
        user_names.push(user.name);
      })
      pay.authBubble(req.body.payId, req.body.amount, req.body.propose, response.group_id, user_names, response.parent, 'dutch');
      console.log("ok")
      res.redirect("/complete/success");
    })
  })
})

module.exports = router;