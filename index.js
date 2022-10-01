"use strict";

const express = require("express");
const app = express();

const { sequelize } = require("./models");

const Board = require("./models/Board");
const User = require("./models/User");

const indexRouter = require("./routes");

//db 연결 부분
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("연결성공");
  })
  .catch((err) => {
    console.error(`연결실패 - ${err}`);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//서버 테스트
app.get("/", (req, res) => {
  return res.send("this is api server");
});

//db 확인용
app.get("/show/user", async (req, res) => {
  const all = await User.findAll();
  return res.status(200).send(all);
});

app.get("/show/board", async (req, res) => {
  const all = await Board.findAll();
  return res.status(200).send(all);
});

//라우터
app.use("/api", indexRouter);

process.on("uncaughtException", (err) => {
  console.error(err);
});
process.on("unhandledRejection", (err) => {
  console.error(err);
});

const port = process.env.PORT || 8000;

// Listening Server
app.listen(port, () => {
  console.log(`Server is up at port:${port}`);
});
