const router = require("express").Router();
const url = require('url');
const { authorize } = require("../../lib/security/accountcontrol");

router.get("/user", authorize(), (req, res) => {
  console.log(req.user)
});

module.exports = router;