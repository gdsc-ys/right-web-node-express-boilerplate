const express = require("express");
const router = express.Router();

const Board = require("../models/Board");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const id = req.payload.id;
  const value = req.body;

  if (value.title && value.body) {
    Board.create({
      title: value.title,
      body: value.body,
      user_id: id,
    });
    return res.status(200).json(value);
  }
});

router.get("/", async (req, res) => {
  Board.findAll().then((info) => {
    return res.status(200).json(info);
  });
});

router.get("/:id", async (req, res) => {
  const value = req.params;
  console.log(req);
  Board.findOne({
    where: { id: value.id },
  }).then((info) => {
    if (info === null) {
      return res.status(400).json({ 결과: "그런 게시물 없어용" });
    } else {
      return res.status(200).json(info);
    }
  });
});

router.patch("/:id", auth, async (req, res) => {
  console.log("요청들어옴");
  const value = req.body;
  const id = req.params.id;
  const user_id = req.payload.id;
  console.log("value", value, "id", id, "user_id", user_id);
  Board.findOne({
    where: { id: id },
  }).then((info) => {
    if (info === null) {
      return res.status(400).json({ 결과: "그런 게시물 없어용" });
    }
    if (info.user_id !== user_id) {
      return res.status(403).json({ 결과: "권한이 없음" });
    }
    if (value.title) {
      Board.update(
        {
          title: value.title,
        },
        {
          where: {
            id: id,
          },
        }
      );
    }
    if (value.body) {
      Board.update(
        {
          body: value.body,
        },
        {
          where: {
            id: id,
          },
        }
      );
    }
    return res.status(200).json({ 결과: "수정 성공함~" });
  });
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const user_id = req.payload.id;
  console.log(id);
  Board.findOne({
    where: { id: id },
  }).then((info) => {
    console.log(info);
    if (info === null) {
      return res.status(400).json({ 결과: "그런 게시물 없어용" });
    }
    if (info.user_id !== user_id) {
      return res.status(403).json({ 결과: "권한이 없음" });
    }
    Board.destroy({
      where: {
        id: id,
      },
    }).then((info) => {
      if (info === 0) {
        return res.status(200).json({ 실패: "해당 게시글 존재 안함" });
      } else {
        return res.status(200).json({ 성공: "삭제" });
      }
    });
  });
});

router.get("/user/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  console.log("어엄...");
  User.findOne({ where: { id: user_id } }).then((info) => {
    if (info == null) {
      return res.status(400).json({ 실패: "그런 유저 없음" });
    } else {
      Board.findAll({ where: { user_id: user_id } }).then((info) => {
        return res.status(200).json(info);
      });
    }
  });
});

module.exports = router;
