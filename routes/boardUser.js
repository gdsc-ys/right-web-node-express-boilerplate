const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const User = require("../models/User");

//유저별 게시글 확인
router.get("/", async (req, res) => {
  Board.findAll().then((info) => {
    return res.status(200).json(info);
  });
});

router.get("/:id", async (req, res) => {
  const value = req.params;
  console.log(req);
  User.findOne({
    where: { id: value.id },
  }).then((info) => {
    if (info === null) {
      return res.status(404).json({ 결과: "그런 유저 없어용" });
    } else {
      Board.findAll({
        where: { user_id: value.id },
      }).then((userBoard) => {
        if (userBoard.length === 0) {
          return res.status(404).json({ 결과: "유저의 게시글이 없어용" });
        } else {
          return res.status(200).json(userBoard);
        }
      });
    }
  });
});

module.exports = router;
