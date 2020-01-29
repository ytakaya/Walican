require('dotenv').config()
const express = require('express');
const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const PORT = 5000;
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);
const lineBot = require('./routes/hook');

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// app.use("/borrow/", require("./routes/borrow.js"));
app.use("/hook", require("./routes/hook.js"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/dutch/", require("./routes/dutch.js"));
app.use("/borrow", require("./routes/borrow.js"));

http.listen(PORT, () => {
  console.log("server listening. Port:" + PORT);
});