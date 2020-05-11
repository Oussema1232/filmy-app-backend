const express = require("express");
const route = express.Router();

// app.set("view engine", "mustache");
// app.set("views", "./views");
route.get("/", (req, res) => {
  // res.render('index', { title: 'Hey', message: 'Hello there! '});
  res.send("Hello world");
});
module.exports = route;
