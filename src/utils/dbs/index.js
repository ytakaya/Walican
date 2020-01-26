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