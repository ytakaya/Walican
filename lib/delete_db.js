const {CONNECTION_URL, DATABASE, OPTIONS} = require("../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;

function delete_all_data(url) {
  MongoClient.connect(url, OPTIONS, (error, client) => {
    const db = client.db(DATABASE);

    db.collection("users", (error, collection) => {    
      collection.find({}).toArray((error, docs) => {
        for (let doc of docs) {
          collection.deleteMany(
            { user_id: doc.user_id },
            (error, obj) => {
              if (error) throw error;
            }
          );
        }
      });
    });

    db.collection("payments", (error, collection) => {    
      collection.find({}).toArray((error, docs) => {
        for (let doc of docs) {
          collection.deleteMany(
            { payments_id: doc.payments_id },
            (error, obj) => {
            }
          );
        }
      });
    });

    db.collection("groups", (error, collection) => {    
      collection.find({}).toArray((error, docs) => {
        for (let doc of docs) {
          collection.deleteMany(
            { group_id: doc.group_id },
            (error, obj) => {
            }
          );
        }
      });
    });
  });
}


delete_all_data(CONNECTION_URL);