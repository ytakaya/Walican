const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);

const questionButtonMessage = require('../utils/messages/questionButtonMessage');
const authButtonMessage = require('../utils/messages/authButtonMessage');

const db_logics = require('../utils/dbs/index.js');

exports.payBubble = function(client, ev) {
  questionButtonMessage().then(res => {
    const {paymentId, questionButton} = res;
    const {userId, groupId} = ev.source;
    const replyToken = ev.replyToken;
    db_logics.insertPayments(userId, groupId, paymentId);

    return client.replyMessage(replyToken, {
      type: "flex",
      altText: "Walicanからのメッセージ",
      contents: questionButton,
    })
  })
}

exports.authBubble = function(payId, group_id, user_names) {
  authButtonMessage(payId, user_names).then(authButton => {
    return client.pushMessage(group_id, {
      type: "flex",
      altText: "Walicanからのメッセージ",
      contents: authButton,
    }).catch((err)=>console.log(err.originalError.response))
  })
}