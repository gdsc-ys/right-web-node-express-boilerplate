"use strict";

const express = require("express");
const app = express();

const morgan = require("morgan");

const { sequelize } = require("./models");

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
app.use(morgan("dev"));

app.use("/", indexRouter);

app.use(function (req, res) {
  return res.status(404).json({ fail: "request not found" });
});

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
