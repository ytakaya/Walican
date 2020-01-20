const {CONNECTION_URL, DATABASE, OPTIONS} = require("../../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;
const generateQuestionButton = require('../utils/generateQuestionButton');

const insertPayments = function(parent_user, group_id, payment_id, replyToken) {
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    const db = client.db(DATABASE);
    db.collection("payments").insertOne(
      {
        payments_id: payment_id,
        replyToken: replyToken,
        group_id: group_id,
        parent: parent_user,
        status: "pending",
      }
    ).catch(() => {
      console.log(error);
    }).then(() => {
      client.close();
    });
  }); 
};

exports.payBubble = function(client, ev) {
  generateQuestionButton().then(res => {
    const {paymentId, questionButton} = res;
    // const {userId, groupId} = ev.source;
    const replyToken = ev.replyToken;
    const userId = 'sample_user_1';
    const groupId = 'sample_group_1';
    insertPayments(userId, groupId, paymentId, replyToken);

    return client.replyMessage(ev.replyToken, {
      type: "flex",
      altText: "Walicanからのメッセージ",
      contents: questionButton,
    })
  })
}