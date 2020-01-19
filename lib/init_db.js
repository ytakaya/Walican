const {CONNECTION_URL, DATABASE, OPTIONS} = require("../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;

const insertUsers = function(db) {
  return Promise.all([
    db.collection("users").insertMany([
      {
        user_id: "sample_user_1",
        user_name: "adam",
        attend_date: new Date(2020, 1, 10),
      },
      {
        user_id: "sample_user_2",
        user_name: "bob",
        attend_date: new Date(2020, 1, 10),
      },
      {
        user_id: "sample_user_3",
        user_name: "eve",
        attend_date: new Date(2020, 1, 10),
      },
    ]),
    db.collection("users").createIndex({ user_id: 1 }, { unique: true, background: true })
  ]);
};

const insertPayments = function(db) {
  return Promise.all([
    db.collection("payments").insertMany([
      {
        payments_id: "sample_payments_1",
        group_id: "sample_group_1",
        methods: "borrow",
        parent: "sample_user_1",
        childs: ["sample_user_2"],
        amounts: 1000,
        currency: "JPY",
      },
      {
        payments_id: "sample_payments_2",
        group_id: "sample_group_1",
        methods: "dutch",
        parent: "sample_user_1",
        childs: ["sample_user_2", "sample_user_3"],
        amounts: 6000,
        currency: "JPY",
      },
    ]),
    db.collection("users").createIndex({ payments_id: 1 }, { unique: true, background: true })
  ]);
};

const insertGroups = function(db) {
  return Promise.all([
    db.collection("groups").insertOne(
      {
        group_id: "sample_group_1",
        group_name: "group1",
        users: ["sample_user_1", "sample_user_2", "sample_user_3"],
      }
    ),
    db.collection("groups").createIndex({ group_id: 1 }, { unique: true, background: true })
  ]);
};

MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
  const db = client.db(DATABASE);
  Promise.all([
    insertUsers(db),
    insertPayments(db),
    insertGroups(db),
  ]).catch(() => {
    console.log(error);
  }).then(() => {
    client.close();
  });
});