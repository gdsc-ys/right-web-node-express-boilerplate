const express = require("express");
const router = express.Router();

const Board = require("../models/Board");
const User = require("../models/User");

router.get("/user", async (req, res) => {
  const all = await User.findAll();
  return res.status(200).send(all);
});

router.get("/board", async (req, res) => {
  const all = await Board.findAll();
  return res.status(200).send(all);
});

module.exports = router;
