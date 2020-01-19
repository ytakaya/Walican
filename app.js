require('dotenv').config()
const express = require('express');
const path = require('path');
const PORT = 5000;
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);

const help = require('./src/help/index');

express()
  .post('/hook/', line.middleware(config) ,(req, res) => lineBot(req, res))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

function lineBot(req, res) {
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
      echoman(ev)
    );
  }
  Promise.all(promises).then(console.log("pass"));
}

function sendMessageToUser(ev) {
  return client.replyMessage(ev.replyToken, {
    type: "text",
    text: `グループに招待して使ってください`
  })
}

async function echoman(ev) {
  const pro = await client.getProfile(ev.source.userId);
  if (ev.message.text == '/help') {
    return help.HelpMessage(client, ev);
  }
  console.log(ev.source.userId);
  console.log(ev.source.groupId);
  // return client.replyMessage(ev.replyToken, {
  //   type: "text",
  //   text: `${pro.displayName}さん、今「${ev.message.text}」って言いました？`
  // })
}