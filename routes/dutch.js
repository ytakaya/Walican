const {CONNECTION_URL, OPTIONS, DATABASE} = require("../config/mongodb.config.js");
const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const url = require('url');

function getUserIdByPayId(pay_id) {
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

function getUserByUserId(user_id) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("users").findOne({
        user_id: user_id
      }).then((user) => {
        const user_info = {
          id: user.user_id,
          name: user.user_name,
          img: user.img,
        }
        resolve(user_info);
      })
    })
  })
}

const getUsersByUserIds = async (user_ids) => {
  const promises = [];
  user_ids.forEach(user_id => {
    promises.push(getUserByUserId(user_id));
  })
  return Promise.all(promises);
}


router.get("/", (req, res) => {
  const payId = url.parse(req.url, true).query.payId;
  getUserIdByPayId(payId).then((user_ids) => {
    getUsersByUserIds(user_ids).then((users) => {
      console.log(users);
    })
    // const doc = {
    //   payId: payId,
    //   users: users,
    // }
    // res.render("../views/dutch.ejs", doc);
  })
});

module.exports = router;