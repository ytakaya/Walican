const router = require("express").Router();
const url = require('url');
const { authorize, userInGroup } = require("../../lib/security/accountcontrol");
const db_logics = require('../../src/utils/dbs/logics');
const pay_method = require('../../config/app.config').pay_method;
const summary_logics = require('../../src/summary/index');

router.get("/user", authorize(), (req, res) => {
  const docs = {};
  db_logics.getGroupsByuserId(req.user.id).then(groups => {
    docs.groups = groups;
    res.render('./account/web/user-page.ejs', docs)
  })
    .catch(err => {
      console.log(err);
      docs.groups = false;
      res.render('./account/web/user-page.ejs', docs)
    })
});

router.get("/groups", userInGroup(), (req, res) => {
  const group_id = url.parse(req.url, true).query.groupId;
  db_logics.getUsersByGroupId(group_id).then(value => {
    const {users, group} = value;
    res.render('./account/web/group_page.ejs', {members: users, group_id: group_id, group_name: group.name});
  })
})

router.get("/history", userInGroup(), (req, res) => {
  const group_id = url.parse(req.url, true).query.groupId;
  db_logics.getPaymentsByGroupId(group_id).then(payments => {
    db_logics.getUsersByGroupId(group_id).then(value => {
      const {group} = value;
      res.render('./account/web/history.ejs', {payments: payments, group_name: group.name});
    })
  })
})

router.get("/payment", userInGroup(), (req, res) => {
  const group_id = url.parse(req.url, true).query.groupId;
  const pay_id = url.parse(req.url, true).query.payId;
  db_logics.getPaymentByPayId(pay_id).then(payment => {
    payment.propose = payment.propose || '---';
    payment.method = pay_method[payment.method];
    db_logics.getUserByUserId(payment.parent).then(parent => {
      db_logics.getUsersByUserIds(Object.keys(payment.children)).then(children => {
        const docs = {
          payment: payment,
          group_id: group_id,
          parent: parent,
          children: children,
        }
        res.render('./account/web/detail.ejs', docs);
      })
    })
  })
})

router.get("/summary", userInGroup(), (req, res) => {
  const group_id = url.parse(req.url, true).query.groupId;
  db_logics.getSummaryAndUsers(group_id).then(value => {
    const datas = value.datas;
    const users = value.users;
    summary_logics.payoff(datas, users).then(summary => {
      const user_id = req.user.id;
      db_logics.getUsersByUserIds(Object.keys(summary[user_id])).then(members => {
        const docs = {
          members: members,
          datas: summary[user_id],
          group_id: group_id
        }
        res.render('./account/web/summary.ejs', docs);
      })
    })
  })
});

router.get("/unauth", (req, res) => {
  const group_id = url.parse(req.url, true).query.groupId;
  const user_id = req.user.id;
  db_logics.getWaitingsList(user_id, group_id).then(waitings => {
    res.send(waitings);
  })
})

module.exports = router;