const {CONNECTION_URL, DATABASE, OPTIONS} = require("../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;

const insertUsers = function(db) {
  return Promise.all([
    db.collection("users").insertMany([
      {
        user_id: "sample_user1",
        user_name: "山田太郎",
        img: "/images/sample_img.png",
      },
      {
        user_id: "sample_user2",
        user_name: "佐藤花子",
        img: "/images/sample_img.png",
      },
      {
        user_id: "sample_user3",
        user_name: "山本健太",
        img: "/images/sample_img.png",
      },
    ]),
    db.collection("users").createIndex({ user_id: 1 }, { unique: true, background: true })
  ]);
};

const insertGroups = function(db) {
  return Promise.all([
    db.collection("groups").insertOne(
      {
        group_id: "test_group",
        group_name: "テストグループ",
        users: ["sample_user1", "sample_user2", "sample_user3"],
      }
    ),
    db.collection("groups").createIndex({ group_id: 1 }, { unique: true, background: true })
  ]);
};

MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
  const db = client.db(DATABASE);
  Promise.all([
    insertUsers(db),
    insertGroups(db),
  ]).catch(() => {
    console.log(error);
  }).then(() => {
    client.close();
  });
});