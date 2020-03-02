require('dotenv').config;
const router = require("express").Router();
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);
const db_logics = require('../src/utils/dbs/logics');

const help = require('../src/help/index');
const connect = require('../src/connect/index');
const pay = require('../src/pay/index');
const auth = require('../src/auth/index');
const summary = require('../src/summary/index');
const rate = require('../src/rate/index');

router.post('/', line.middleware(config), (req, res) => {
  res.status(200).end();
  const events = req.body.events;
  const promises = [];
  for (let i = 0, l = events.length; i < l; i++) {
    const ev = events[i];
    if (ev.source.groupId == null) {
      replyMessageWithToken(ev.replyToken, `グループに招待して使ってください`);
      return;
    }
  //   promises.push(
  //     getCommand(ev)
  //   );

    getCommand(ev)
      .catch(err => {
        console.log(err);
      })
  }
  // Promise.all(promises).then(console.log("pass"));
});

function replyMessageWithToken(replyToken, message) {
  return client.replyMessage(replyToken, {
    type: "text",
    text: message
  })
}


async function getCommand(ev) {
  console.log(ev.message.text);
  if (ev.message.text == '/help') {
    return help.HelpMessage(client, ev);
  }
  else if (ev.message.text == '/connect') {
    const pro = await client.getProfile(ev.source.userId);
    return connect.connectUser(ev.source, pro, client, ev);
  }
  else if (ev.message.text == '/pay') {
    return pay.payBubble(client, ev);
  }
  else if (ev.message.text == '/summary') {
    return summary.summaryReply(client, ev);
  }
  else if (ev.message.text.split(' ')[0] == '/auth') {
    const payId = ev.message.text.split(' ')[1]
    const userId = ev.source.userId;
    const pro = await client.getProfile(ev.source.userId);
    auth.authUserByPayId(userId, payId).then(res => {
      console.log(res);
      if (res == 'alreadyAuthed') {
        replyMessageWithToken(ev.replyToken, `${pro.displayName}は認証済みだよ`);
      } else if (res == 'invalidUser') {
        replyMessageWithToken(ev.replyToken, `${pro.displayName}は関係ないよ`);
      } else if (res == 'authComplete') {
        replyMessageWithToken(ev.replyToken, `payId:${payId}は全員が認証したよ`);
      } else if (res == 'updated') {
        replyMessageWithToken(ev.replyToken, `${pro.displayName}が認証したよ`);
      }
    })
  }
  else if (ev.message.text.split(' ')[0] == '/init') {
    const groupName = ev.message.text.replace(/\/init /, '');
    db_logics.changeGroupName(ev.source.groupId, groupName)
      .then(() => {
        replyMessageWithToken(ev.replyToken, `グループ名を${groupName}に変更しました😊`);
      })
      .catch(err => {
        console.log(err);
        replyMessageWithToken(ev.replyToken, `グループ名の変更に失敗しました😢`);
      })
  }
  else if (ev.message.text == '/rate') {
    return rate.rateReply(client, ev);
  }
}

module.exports = router;