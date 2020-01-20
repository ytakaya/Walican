const generateQuestionButton = require('../utils/generateQuestionButton');
const questionButton = generateQuestionButton();

exports.payBubble = function(client, ev) {
  return client.replyMessage(ev.replyToken, {
    type: "flex",
    altText: "Walicanからのメッセージ",
    contents: questionButton,
  })
}