const router = require("express").Router();
const url = require('url');
const { authorize, userInGroup } = require("../../lib/security/accountcontrol");
const db_logics = require('../..//src/utils/dbs/logics');

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
  console.log(group_id, pay_id)
  res.send(200)
})

module.exports = router;