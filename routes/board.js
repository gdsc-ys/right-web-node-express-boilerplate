const express = require("express");
const router = express.Router();
const Board = require("../models/Board")
const boardUserRouter = require("./boardUser");

router.use("/user", boardUserRouter);

//user crud
router.post("/", async (req, res) => {
  const value = req.body;
  console.log(value);
  // res.status(200).send(value);

  if (value.title && value.body && value.user_id) {
    Board.create({
      title: value.title,
      body: value.body,
      user_id: value.user_id,
    });
    return res.status(200).json(value);
  } else {
    return res
      .status(400)
      .json({ 실패: "쿼리에 타이틀 바디 아이디 다 넣어주세요" });
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
      return res.status(404).json({ 결과: "그런 게시물 없어용" });
    } else {
      return res.status(200).json(info);
    }
  });
});

router.patch("/", async (req, res) => {
  const value = req.body;
  console.log(value);
  if (!value.id) {
    return res.status(400).json({ 실패: "아이디 보내줘" });
  }
  if (value.title) {
    Board.update(
      {
        title: value.title,
      },
      {
        where: {
          id: value.id,
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
          id: value.id,
        },
      }
    );
  }
  return res.status(200).json({ 성공: "뭘 하긴했다" });
});

router.delete("/", async (req, res) => {
  const value = req.body;
  if (value.id) {
    Board.destroy({
      where: {
        id: value.id,
      },
    }).then((info) => {
      if (info === 0) {
        return res.status(200).json({ 실패: "그런 게시글 없음" });
      } else {
        return res.status(200).json(info);
      }
    });
  } else {
    return res.status(400).json({ 실패: "글 번호 정도는 보내주라" });
  }
});

module.exports = router;
