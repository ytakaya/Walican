const {CONNECTION_URL, DATABASE, OPTIONS} = require("../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config()

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
    ])
  ]);
};

const insertGroups = function(db) {
  return Promise.all([
    db.collection("groups").insertOne(
      {
        group_id: process.env.TEST_GROUP_ID,
        group_name: "テストグループ",
        users: [process.env.HOST_USER_ID, "sample_user1", "sample_user2", "sample_user3"],
      }
    )
  ]);
};

const insertSummary = function(db) {
  return Promise.all([
    db.collection("users").insertMany([
      {
        payments_id: 'sample_payments1',
        group_id: process.env.TEST_GROUP_ID,
        parent: process.env.HOST_USER_ID,
        amount: 500,
        method: "borrow",
        children: ["sample_user1"]
      },
      {
        payments_id: 'sample_payments2',
        group_id: process.env.TEST_GROUP_ID,
        parent: "sample_user1",
        amount: 1000,
        method: "borrow",
        children: [process.env.HOST_USER_ID]
      },
    ])
  ]);
};

const insertPayments = function(db) {
  return Promise.all([
    db.collection("payments").insertMany([
      {
        payments_id: "sample_payments3",
        group_id: process.env.TEST_GROUP_ID,
        methods: "borrow",
        parent: "sample_user3",
        children: {
          [process.env.HOST_USER_ID]: false,
        },
        amounts: 2000,
        currency: "JPY",
        date: new Date(),
        status: "pending",
        propose: "お昼ご飯",
      },
      {
        payments_id: "sample_payments4",
        group_id: process.env.TEST_GROUP_ID,
        methods: "borrow",
        parent: "sample_user1",
        children: {
          [process.env.HOST_USER_ID]: false,
        },
        amounts: 300,
        currency: "JPY",
        status: "pending",
        date: new Date(),
        propose: "タピオカ",
      },
    ])
  ]);
};

const insertWaitings = function(db) {
  return Promise.all([
    db.collection("waitings").insertMany([
      {
        payments_id: "sample_payments3",
        group_id: process.env.TEST_GROUP_ID,
        user: process.env.HOST_USER_ID,
      },
      {
        payments_id: "sample_payments4",
        group_id: process.env.TEST_GROUP_ID,
        user: process.env.HOST_USER_ID,
      },
    ])
  ]);
};

MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
  const db = client.db(DATABASE);
  Promise.all([
    insertUsers(db),
    insertGroups(db),
    insertSummary(db),
    insertPayments(db),
    insertWaitings(db),
  ]).catch(() => {
    console.log(error);
  }).then(() => {
    client.close();
  });
});