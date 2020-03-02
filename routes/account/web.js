const router = require("express").Router();
const url = require('url');
const { authorize } = require("../../lib/security/accountcontrol");
const db_logics = require('../..//src/utils/dbs/logics');

router.get("/user", authorize(), (req, res) => {
  const docs = {
    userName: req.user.name,
    userId: req.user.id,
    userImg: req.user.img
  }
  db_logics.getGroupsByuserId(req.user.id).then(groups => {
    console.log(groups)
    docs.groups = groups;
    res.render('./account/web/user-page.ejs', docs)
  })
    .catch(err => {
      console.log(err);
      res.render('./account/web/user-page.ejs', docs)
    })
});

module.exports = router;