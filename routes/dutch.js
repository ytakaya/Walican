const {CONNECTION_URL, OPTIONS, DATABASE} = require("../config/mongodb.config.js");
const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const url = require('url');

function getUsersByPayId(pay_id) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("payments").findOne({
        payments_id: pay_id
      }).then((payment) => {
        db.collection("groups").findOne({
          group_id: payment.group_id,
        }).then((group) => {
          resolve(group.users)
        })
      }).catch((error) => {
        throw error;
      }).then(() => {
        client.close();
      });
    });
  })
}


router.get("/", (req, res) => {
  const payId = url.parse(req.url, true).query.payId;
  getUsersByPayId(payId).then((users) => {
    const doc = {
      payId: payId,
      users: users,
    }
    res.render("../views/dutch.ejs", doc);
  })
});

module.exports = router;