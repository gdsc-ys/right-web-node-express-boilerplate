const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");

const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  const value = req.body;

  const password = await bcrypt.hash(value.password, 12);

  if (value.id && value.password && value.email && value.part) {
    User.create({
      id: value.id,
      password: password,
      email: value.email,
      part: value.part,
      role: 0,
    });
    return res.status(200).json(value);
  } else {
    return res
      .status(400)
      .json({ 실패: "쿼리에 아이디, 패스워드, 이메일, 파트 다 넣어주세요" });
  }
});

router.get("/", auth, async (req, res) => {
  const id = req.payload.id;
  console.log(id);
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
  if (value.part) {
    await User.update(
      {
        part: value.part,
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

router.get("/part/:part", async (req, res) => {
  const part = req.params.part;
  User.findAll({
    where: {
      part: part,
    },
    attributes: ["id", "email"],
  }).then((info) => {
    if (info === 0) {
      return res.status(200).json({ 실패: "없는 파트" });
    } else {
      return res.status(200).json(info);
    }
  });
});

router.get("/check", async (req, res) => {
  const id = req.query.id;
  const email = req.query.email;
  if (id) {
    User.findOne({
      where: { id: id },
    }).then((info) => {
      if (info === null) {
        return res.status(200).json({ 결과: "생성 가능한 아이디" });
      } else {
        return res.status(400).json({ 결과: "존재하는 아이디" });
      }
    });
  }
  if (email) {
    User.findOne({
      where: { email: email },
    }).then((info) => {
      if (info === null) {
        return res.status(200).json({ 결과: "생성 가능한 이메일" });
      } else {
        return res.status(400).json({ 결과: "존재하는 이메일" });
      }
    });
  }
});
module.exports = router;
