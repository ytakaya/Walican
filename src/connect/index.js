const {CONNECTION_URL, DATABASE, OPTIONS} = require("../../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;

exports.connectUser = async (evsource, user_profile, client, ev) => {
  const status = await registGroupAndUser(evsource, user_profile);

  let text;
  if (status == 'alreadyRegisted') {
    text = `「${user_profile.displayName}」は登録済みだよ！`
  } else if (status == 'success') {
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
      ]).catch(() => {
        console.log(error);
      }).then(() => {
        client.close();
      });
    });
    resolve("ok")
  })
}

// router.post("/*", (req, res) => {
//   MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
//     const db = client.db(DATABASE);
//     db.collection("rooms").findOne({
//       room_url: "/sample.html"
//     }).then((room) => {
//       db.collection("messages").find({
//         room_url: room.room_url,
//       }).toArray((err, messages) => {
//         if (err) throw err;
//         const doc = {
//           room: room,
//           messages: messages,
//           user_name: req.body.user_name,
//         };
//         res.render("./rooms/index.ejs", doc);
//       });
//     }).catch((error) => {
//       throw error;
//     }).then(() => {
//       client.close();
//     });
//   });
// });

const findAndInsertGroups = function(db, group_id, user_id) {
  return new Promise(resolve => {
    db.collection("groups").findOne({
      group_id: group_id
    }).then((group) => {
      if (group != null) {
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

// const findAndInsertUsers = function(db, user_profile) {
//   return Promise.all([
//     db.collection("users").insertMany([
//       {
//         user_id: "sample_user_1",
//         user_name: "adam",
//         img: "/images/sample_img.png",
//         attend_date: new Date(2020, 1, 10),
//       },
//       {
//         user_id: "sample_user_2",
//         user_name: "bob",
//         img: "/images/sample_img.png",
//         attend_date: new Date(2020, 1, 10),
//       },
//       {
//         user_id: "sample_user_3",
//         user_name: "eve",
//         img: "/images/sample_img.png",
//         attend_date: new Date(2020, 1, 10),
//       },
//     ]),
//     db.collection("users").createIndex({ user_id: 1 }, { unique: true, background: true })
//   ]);