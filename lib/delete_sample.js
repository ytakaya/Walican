const {CONNECTION_URL, DATABASE, OPTIONS} = require("../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config()

function delete_all_data(url) {
  MongoClient.connect(url, OPTIONS, (error, client) => {
    const db = client.db(DATABASE);

    Promise.all([
      db.collection("users", (error, collection) => {
        docs = ["sample_user1", "sample_user2", "sample_user3"];
        docs.forEach(user_id => {
          collection.deleteOne(
            { user_id: user_id },
            (error, obj) => {
              if (error) throw error;
            }
          );
        })
      }),
      db.collection("payments", (error, collection) => { 
        docs = ["sample_payments3", "sample_payments4"];
        docs.forEach(payments_id => {
          collection.deleteOne(
            { payments_id: payments_id },
            (error, obj) => {
            }
          );
        });
      }),
      db.collection("groups", (error, collection) => {
        collection.deleteOne(
          { group_id: process.env.TEST_GROUP_ID },
          (error, obj) => {
          }
        );
      }),
      db.collection("summary", (error, collection) => { 
        docs = ["sample_payments1", "sample_payments2", "sample_payments3", "sample_payments4"];
        docs.forEach(payments_id => {
          collection.deleteOne(
            { payments_id: payments_id },
            (error, obj) => {
            }
          );
        });
      }),
      client.close(),
    ])

  });
}


delete_all_data(CONNECTION_URL);