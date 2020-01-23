const {CONNECTION_URL, DATABASE, OPTIONS} = require("../../config/mongodb.config");
const MongoClient = require("mongodb").MongoClient;
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);

const generateQuestionButton = require('../utils/generateQuestionButton');
const generateAuthButton = require('../utils/generateAuthButton');

const insertPayments = function(parent_user, group_id, payment_id, replyToken) {
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

exports.payBubble = function(client, ev) {
  generateQuestionButton().then(res => {
    const {paymentId, questionButton} = res;
    const {userId, groupId} = ev.source;
    const replyToken = ev.replyToken;
    insertPayments(userId, groupId, paymentId);

    return client.replyMessage(replyToken, {
      type: "flex",
      altText: "Walicanからのメッセージ",
      contents: questionButton,
    })
  })
}

exports.authBubble = function(payId, group_id, user_names) {
  generateAuthButton(payId, user_names).then(authButton => {
    return client.pushMessage(group_id, {
      type: "flex",
      altText: "Walicanからのメッセージ",
      contents: authButton,
    }).catch((err)=>console.log(err.originalError.response))
  })
}