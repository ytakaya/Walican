require('dotenv').config()
const express = require('express');
const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const PORT = 8080;

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use("/hook", require("./routes/hook.js"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/dutch/", require("./routes/dutch.js"));
app.use("/borrow/", require("./routes/borrow.js"));
app.use("/complete/", require("./routes/complete.js"));
app.use("/auth_status/", require("./routes/auth_status.js"));
app.use("/cancel/", require("./routes/cancel.js"));

http.listen(PORT, () => {
  console.log("server listening. Port:" + PORT);
});