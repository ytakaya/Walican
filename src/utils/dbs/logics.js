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
        _findAndInsertUsers(db, evsource.userId, user_profile, evsource.groupId),
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

const _findAndInsertUsers = function(db, user_id, user_profile, group_id) {
  return new Promise(resolve => {
    db.collection("users").findOne({
      user_id: user_id
    }).then((user) => {
      if (user != null && user.groups.indexOf(group_id) >= 0) {
        console.log("user already registed")
        resolve(true);
      }
      else if (user.groups.indexOf(group_id) == -1) {
        user.groups.push(group_id);
          db.collection("users").updateOne({
            user_id: user_id
          }, {
            $set: user
          }).then(() => {
            console.log("insert group to user");
            resolve(true);
          })
      }
      else {
        const pictureUrl = (user_profile.pictureUrl) ? user_profile.pictureUrl : '/images/sample_img.png';
        db.collection("users").insertOne(
          {
            user_id: user_id,
            user_name: user_profile.displayName,
            img: pictureUrl,
            groups: [group_id],
          }
        ).then(() => {
          console.log("create user");
          resolve(true);
        })
      }
    })
  })
}

exports.getGroupIdAndParentByPayId = function(pay_id) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("payments").findOne({
        payments_id: pay_id
      }).then((payment) => {
        resolve({group_id: payment.group_id, parent: payment.parent});
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
            payment_status: payment.status,
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

exports.getUserByUserId = (user_id) => {
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
    promises.push(exports.getUserByUserId(user_id));
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

exports.getChildrenByPayId = function(pay_id) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("payments").findOne({
        payments_id: pay_id
      }).then((payment) => {
        resolve(payment.children);
      }).catch((error) => {
        throw error;
      }).then(() => {
        client.close();
      });
    });
  })
}

exports.insertSummary = function(payment_id, group_id, parent, amount, method, children) {
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    const db = client.db(DATABASE);
    db.collection("summary").insertOne(
      {
        payments_id: payment_id,
        group_id: group_id,
        parent: parent,
        amount: amount,
        method: method,
        children: children,
      }
    ).catch(() => {
      console.log(error);
    }).then(() => {
      client.close();
    });
  }); 
};

function _getUserIdsByGroupId(groupId) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("groups").findOne({
        group_id: groupId
      }).then((group) => {
        resolve(group.users);
      }).catch((error) => {
        throw error;
      }).then(() => {
        client.close();
      });
    });
  })
}

exports.getSummaryAndUsers = function(groupId) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
  
      _getUserIdsByGroupId(groupId).then(users => {
        db.collection("summary").find({
          group_id: groupId,
        }).toArray((error, datas) => {
            resolve({datas: datas, users: users});
          });
        });
    })
  })
}

exports.changeGroupName = function(group_id, group_name) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("groups").findOne({
        group_id: group_id
      }).then((group) => {
        if (group != null) {
          group.name = group_name;
          db.collection("groups").updateOne({
            group_id: group_id
          }, {
            $set: group
          }).then(() => {
            console.log("update groupName");
            resolve(true);
          })
        }
        else {
          db.collection("groups").insertOne(
            {
              group_id: group_id,
              name: group_name,
              users: [],
            }
          ).then(() => {
            console.log("create group");
            resolve(true);
          })
        }
      })
    });
  })
}

exports.getGroupsByuserId = (user_id) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("users").findOne({
        user_id: user_id
      }).then((user) => {
        if (!user.groups)
          reject('groups not exist');
        else
          exports.getGroupsByGroupIds(user.groups).then(groups => {
            resolve(groups);
          })
      })
    })
  })
}

exports.getGroupByGroupId = (group_id) => {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      db.collection("groups").findOne({
        group_id: group_id
      }).then((group) => {
        const group_info = {
          id: group.group_id,
          name: group.name,
        }
        resolve(group_info);
      })
    })
  })
}

exports.getGroupsByGroupIds = async (group_ids) => {
  const promises = [];
  group_ids.forEach(group_id => {
    promises.push(exports.getGroupByGroupId(group_id));
  })
  return Promise.all(promises);
}