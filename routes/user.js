const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("../services/token");

const auth = require("../middleware/auth");
//login

router.post("/login", async (req, res) => {
  const value = req.body;
  if (value.id) {
    console.log(value.id);
    User.findOne({
      where: { id: value.id },
    }).then((info) => {
      if (info === null) {
        return res.status(404).json({ 결과: "그런 아이디 없음" });
      } else {
        const match = bcrypt.compareSync(value.password, info.password);
        if (match) {
          console.log("아이디:", info.id, "이메일:", info.email);
          jwt.sign({ id: info.id, email: info.email }).then((token) => {
            // jwt.verify(token.token).then((decode) => {
            //   console.log(decode);
            // });
            return res
              .status(200)
              .cookie("token", token.token, { httpOnly: true })
              .json({ 성공: "로그인" });
          });
        } else {
          return res.status(404).json({ 결과: "로그인 실패" });
        }
      }
    });
  }
});

//user crud
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
  const value = req.query;
  //console.log(req);
  if (value.id) {
    User.findOne({
      where: { id: value.id },
    }).then((info) => {
      if (info === null) {
        return res.status(404).json({ 결과: "그런 사람 없음" });
      } else {
        return res.status(200).json(info);
      }
    });
  } else {
    return res.status(400).json({ 실패: "아이디 정도는 보내주라" });
  }
});

router.patch("/", auth, async (req, res) => {
  const value = req.body;

  if (!value.id) {
    return res.status(400).json({ 실패: "아이디 보내줘" });
  }

  if (value.password) {
    const password = await bcrypt.hash(value.password, 12);
    User.update(
      {
        password: password,
      },
      {
        where: {
          id: value.id,
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
          id: value.id,
        },
      }
    );
  }
  return res.status(200).json({ 성공: "뭘 하긴했다" });
});

router.delete("/", auth, async (req, res) => {
  const value = req.body;
  if (value.id) {
    User.destroy({
      where: {
        id: value.id,
      },
    }).then((info) => {
      if (info === 0) {
        return res.status(200).json({ 실패: "그런거 없음" });
      } else {
        return res.status(200).json(info);
      }
    });
  } else {
    return res.status(400).json({ 실패: "아이디 정도는 보내주라" });
  }
});

module.exports = router;
