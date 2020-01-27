const {CONNECTION_URL, DATABASE, OPTIONS} = require("../../../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;

exports.insertPayments = function(parent_user, group_id, payment_id) {
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    const db = client.db(DATABASE);
    db.collection("payments").insertOne(
      {
        payments_id: payment_id,
        group_id: group_id,
        parent: parent_user,
        amount: 0,
        children: {},
        status: "pending",
      }
    ).catch(() => {
      console.log(error);
    }).then(() => {
      client.close();
    });
  }); 
};

exports.registGroupAndUser = function(evsource, user_profile) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      Promise.all([
        _findAndInsertGroups(db, evsource.groupId, evsource.userId),
        _findAndInsertUsers(db, evsource.userId, user_profile),
      ]).catch(() => {
        console.log(error);
        resolve(false);
      }).then((v) => {
        resolve(v[0]);
        client.close();
      });
    });
  })
}

const _findAndInsertGroups = function(db, group_id, user_id) {
  return new Promise(resolve => {
    db.collection("groups").findOne({
      group_id: group_id
    }).then((group) => {
      if (group != null) {
        if (group.users.indexOf(user_id) != -1) {
          console.log("already inserted to group")
          resolve("alreadyRegisted");
        }
        else {
          group.users.push(user_id);
          db.collection("groups").updateOne({
            group_id: group_id
          }, {
            $set: group
          }).then(() => {
            console.log("insert user to group");
            resolve(true);
          })
        }
      }
      else {
        db.collection("groups").insertOne(
          {
            group_id: group_id,
            users: [user_id],
          }
        ).then(() => {
          console.log("create group");
          resolve(true);
        })
      }
    })
  })
};

const _findAndInsertUsers = function(db, user_id, user_profile) {
  return new Promise(resolve => {
    db.collection("users").findOne({
      user_id: user_id
    }).then((user) => {
      if (user != null) {
        console.log("user already registed")
        resolve(true);
      }
      else {
        db.collection("users").insertOne(
          {
            user_id: user_id,
            user_name: user_profile.displayName,
            img: user_profile.pictureUrl,
          }
        ).then(() => {
          console.log("create user");
          resolve(true);
        })
      }
    })
  })
}

exports.getGroupIdByPayId = function(pay_id) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("payments").findOne({
        payments_id: pay_id
      }).then((payment) => {
        resolve(payment.group_id);
      }).catch((error) => {
        throw error;
      }).then(() => {
        client.close();
      });
    });
  })
}

exports.getUserIdByPayId = function(pay_id) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("payments").findOne({
        payments_id: pay_id
      }).then((payment) => {
        db.collection("groups").findOne({
          group_id: payment.group_id,
        }).then((group) => {
          const res = {
            parent: payment.parent,
            user_ids: group.users,
          }
          resolve(res);
        })
      }).catch((error) => {
        throw error;
      }).then(() => {
        client.close();
      });
    });
  })
}

function _getUserByUserId(user_id) {
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

exports.getUsersByUserIds = async (user_ids) => {
  const promises = [];
  user_ids.forEach(user_id => {
    promises.push(_getUserByUserId(user_id));
  })
  return Promise.all(promises);
}

exports.updatePayments = function(payId, element) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("payments").updateOne({
        payments_id: payId
      }, {
        $set: element
      }).then(() => {
        client.close();
      })
    })
  })
}

exports.getPaymentByPayId = function(pay_id) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("payments").findOne({
        payments_id: pay_id
      }).then((payment) => {
        resolve(payment);
      }).catch((error) => {
        throw error;
      }).then(() => {
        client.close();
      });
    });
  })
}

exports.insertSummary = function(payment_id, group_id, parent, amount, children) {
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    const db = client.db(DATABASE);
    db.collection("summary").insertOne(
      {
        payments_id: payment_id,
        group_id: group_id,
        parent: parent,
        amount: amount,
        children: children,
      }
    ).catch(() => {
      console.log(error);
    }).then(() => {
      client.close();
    });
  }); 
};