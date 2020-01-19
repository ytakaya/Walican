require('dotenv').config()
const express = require('express');
const app = express();
const http = require("http").Server(app);
const PORT = 5000;
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);
const lineBot = require('./routes/hook');

const help = require('./src/help/index');

// app.use("/borrow/", require("./routes/borrow.js"));
// app.use("/dutch/", require("./routes/dutch.js"));
app.use("/hook", require("./routes/hook.js"));

http.listen(PORT, () => {
  console.log("server listening. Port:" + PORT);
});