const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");

const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  const value = req.body;

  const password = await bcrypt.hash(value.password, 12);

  if (value.id && value.password && value.email) {
    User.create({
      id: value.id,
      password: password,
      email: value.email,
      role: 0,
    });
    return res.status(200).json(value);
  } else {
    return res
      .status(400)
      .json({ 실패: "쿼리에 아이디, 패스워드, 이메일 다 넣어주세요" });
  }
});

router.get("/", auth, async (req, res) => {
  const id = req.payload.id;
  User.findOne({
    where: { id: id },
  }).then((info) => {
    if (info === null) {
      return res.status(400).json({ 결과: "그런 사람 없음" });
    } else {
      delete info.dataValues.password;
      delete info.dataValues._previousDataValues;
      return res.status(200).json(info);
    }
  });
});

router.patch("/", auth, async (req, res) => {
  const value = req.body;
  const id = req.payload.id;

  if (value.password) {
    const password = await bcrypt.hash(value.password, 12);
    User.update(
      {
        password: password,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }
  if (value.email) {
    await User.update(
      {
        email: value.email,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }
  return res.status(200).json({ 성공: "뭘 하긴했다" });
});

router.delete("/", auth, async (req, res) => {
  const id = req.payload.id;
  User.destroy({
    where: {
      id: id,
    },
  }).then((info) => {
    if (info === 0) {
      return res.status(200).json({ 실패: "그런거 없음" });
    } else {
      return res
        .status(200)
        .cookie("token", "", { httpOnly: true })
        .json({ 성공: "탈퇴" });
    }
  });
});

module.exports = router;
