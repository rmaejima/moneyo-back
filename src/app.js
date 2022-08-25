const express = require("express");
const app = express();

// ルーティングの設定
app.get("/", (req, res) => {
  return res.send("Hello");
});
app.get("/users", (req, res) => {
  return res.send("user");
});

// 他にルーティングなどの設定を行っていたらここに書いてください

module.exports = app;
