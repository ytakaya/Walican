require('dotenv').config()
const { SESSION_SECRET } = require("./config/app.config").security;
const express = require('express');
const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const accountcontrol = require("./lib/security/accountcontrol");
const { authorize } = require("./lib/security/accountcontrol");
const PORT = 8080;

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use("/hook", require("./routes/hook.js"));

app.use(cookieParser());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "sid"
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());
app.use(...accountcontrol.initialize());

app.get('/', authorize('readWrite'), (req, res) => res.send('welcome walican'))
app.use("/dutch/", require("./routes/dutch.js"));
app.use("/borrow/", require("./routes/borrow.js"));
app.use("/complete/", require("./routes/complete.js"));
app.use("/auth_status/", require("./routes/auth_status.js"));
app.use("/cancel/", require("./routes/cancel.js"));
app.use("/oauth/", require("./routes/oauth.js"));

http.listen(PORT, () => {
  console.log("server listening. Port:" + PORT);
});