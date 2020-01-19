const router = require("express").Router();
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);

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
    promises.push(
      getCommand(ev)
    );
  }
  Promise.all(promises).then(console.log("pass"));
});

function sendMessageToUser(ev) {
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: `グループに招待して使ってください`
  })
}

const box = {
  "type": "bubble",
  "body": {
    "type": "box",
    "layout": "vertical",
    "spacing": "md",
    "contents": [
      {
              "type": "text",
              "text": "選択してピエ"
      },
      {
        "type": "button",
        "style": "primary",
        "action": {
          "type": "uri",
          "label": "割り勘",
          "uri": "https://c06164a6.ngrok.io/dutch/?payId="
        }
      },
      {
        "type": "button",
        "style": "primary",
        "action": {
          "type": "uri",
          "label": "貸した",
          "uri": "https://c06164a6.ngrok.io/borrow/?payId="
        }
      },
    ]
  }
};

async function getCommand(ev) {
  const pro = await client.getProfile(ev.source.userId);
  console.log(ev.message.text);
  if (ev.message.text == '/help') {
    return help.HelpMessage(client, ev);
  }
  else if (ev.message.text == '/attend') {
    console.log("attend");
  }
  return client.replyMessage(ev.replyToken, {
    type: "flex",
    altText: "Walicanからのメッセージ",
    contents: box,
  })
}

module.exports = router;