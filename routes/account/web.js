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
  db_logics.getUsersByGroupId(group_id).then(users => {
    res.render('./account/web/group_page.ejs', {members: users, group_id: group_id});
  })
})

router.get("/history", userInGroup(), (req, res) => {
  const group_id = url.parse(req.url, true).query.groupId;
  db_logics.getPaymentsByGroupId(group_id).then(payments => {
    console.log(payments)
    res.send(200)
  })
})

module.exports = router;