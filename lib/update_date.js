const {CONNECTION_URL, DATABASE, OPTIONS} = require("../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;

const getPromise = function(db) {
  return new Promise(resolve => {
    db.collection("payments").find({}).toArray((error, payments) => {
      const promises = [];
      payments.forEach(payment => {
        payment.date = new Date();
        promises.push(updateDate(db, payment));
      })
      resolve(Promise.all(promises));
    });
  })
};

const updateDate = function(db, payment) {
  return new Promise(resolve => {
    db.collection("payments").updateOne({
      payments_id: payment.payments_id
    }, {
      $set: payment
    }).then(() => {
      resolve('ok');
    })
  })
}

MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
  const db = client.db(DATABASE);
  getPromise(db).catch(() => {
    console.log(error);
  }).then(() => {
    console.log('all updated.');
    client.close();
  });
});