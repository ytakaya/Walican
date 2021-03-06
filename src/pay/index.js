const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);

const questionButtonMessage = require('../utils/messages/questionButtonMessage');
const authMessage = require('../utils/messages/authMessage');

const db_logics = require('../utils/dbs/logics.js');

exports.payBubble = function(client, ev) {
  const {userId, groupId} = ev.source;
  questionButtonMessage(groupId).then(res => {
    const {paymentId, questionButton} = res;
    const replyToken = ev.replyToken;
    db_logics.insertPayments(userId, groupId, paymentId);

    return client.replyMessage(replyToken, {
      type: "flex",
      altText: "Walicanからのメッセージ",
      contents: questionButton,
    })
  })
}

exports.authBubble = function(payId, data, propose, group_id, user_names, parent, method) {
  authMessage(data, propose, payId, user_names, parent, method).then(res => {
    return client.pushMessage(group_id, {
      type: "flex",
      altText: "Walicanからのメッセージ",
      contents: res.authInfo
    })
      .catch((err)=>console.log(err.originalError.response))
      .then(() => {
        client.pushMessage(group_id, {
          type: "text",
          text: res.authMessage
        })
          .catch((err)=>console.log(err.originalError.response))
      })
  })
}