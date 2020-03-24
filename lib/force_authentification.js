const {CONNECTION_URL, DATABASE, OPTIONS} = require("../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;

const getPromise = function(db) {
  return new Promise(resolve => {
    db.collection("payments").find({}).toArray((error, payments) => {
      const promises = [];
      payments.forEach(payment => {
        Object.keys(payment.children).forEach(child => {
          payment.children[child] = true;
        })
        promises.push(updatePayment(db, payment));
        promises.push(insertSummary(db, payment));
      })
      resolve(Promise.all(promises));
    });
  })
};

const updatePayment = function(db, payment) {
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

const insertSummary = function(db, payment) {
  return new Promise(resolve => {
    db.collection("summary").insertOne(
      {
        payments_id: payment.payments_id,
        group_id: payment.group_id,
        parent: payment.parent,
        amount: payment.amount,
        method: payment.method,
        children: Object.keys(payment.children),
      }
    ).then(() => {
      resolve('ok');
    })
  })
};

MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
  const db = client.db(DATABASE);
  getPromise(db).catch(() => {
    console.log(error);
  }).then(() => {
    console.log('all updated.');
    client.close();
  });
});