const router = require("express").Router();
const url = require('url');
const { authorize } = require("../../lib/security/accountcontrol");

router.get("/user", authorize(), (req, res) => {
  const docs = {
    userName: req.user.name,
    userId: req.user.id,
    userImg: req.user.img
  }
  res.render('./account/web/user-page.ejs', docs)
});

module.exports = router;