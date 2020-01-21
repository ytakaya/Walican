const router = require("express").Router();
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);

const help = require('../src/help/index');
const connect = require('../src/connect/index');
const pay = require('../src/pay/index');

router.post('/', line.middleware(config), (req, res) => {
  res.status(200).end();
  const events = req.body.events;
  const promises = [];
  for (let i = 0, l = events.length; i < l; i++) {
    const ev = events[i];
    if (ev.source.groupId == null) {
      sendMessageToUser(ev);
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

function sendMessageToUser(ev) {
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: `グループに招待して使ってください`
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
}

module.exports = router;