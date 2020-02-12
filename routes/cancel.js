const router = require("express").Router();
const url = require('url');

const db_logics = require('../src/utils/dbs/logics');


router.get("/", (req, res) => {
  const payId = url.parse(req.url, true).query.payId;
  db_logics.getUserIdByPayId(payId).then((payment) => {
    const { payment_status } = payment;
    if (payment_status === 'pending') {
      db_logics.updatePayments(payId, {status: "canceled"});
      res.redirect('/complete/cancel')
    }
    else {
      res.redirect('/complete/alreadyAuthSend')
    }
  })
});

module.exports = router;