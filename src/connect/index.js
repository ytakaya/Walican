const {CONNECTION_URL, DATABASE, OPTIONS} = require("../../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;

exports.connectUser = async (evsource, user_profile, client, ev) => {
  const status = await registGroupAndUser(evsource, user_profile);

  let text;
  if (status == 'alreadyRegisted') {
    text = `「${user_profile.displayName}」は登録済みだよ！`
  } else if (status) {
    text = `「${user_profile.displayName}」を登録したよ！`
  } else {
    text = `「${user_profile.displayName}」を登録に失敗したよ...`
  }

  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: text
  })
}

function registGroupAndUser(evsource, user_profile) {
  return new Promise(resolve => {
    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      const db = client.db(DATABASE);
      Promise.all([
        findAndInsertGroups(db, evsource.groupId, evsource.userId),
        findAndInsertUsers(db, evsource.userId, user_profile),
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

const findAndInsertGroups = function(db, group_id, user_id) {
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

const findAndInsertUsers = function(db, user_id, user_profile) {
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