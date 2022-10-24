const express = require("express");
const router = express.Router();

const jwt = require("../utils/token");
const auth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const value = req.body;
  if (value.id) {
    User.findOne({
      where: { id: value.id },
    }).then((info) => {
      if (info === null) {
        return res.status(400).json({ 결과: "그런 아이디 없음" });
      } else {
        const match = bcrypt.compareSync(value.password, info.password);
        if (match) {
          jwt.sign({ id: info.id, email: info.email }).then((token) => {
            return res
              .status(200)
              .cookie("token", token.token, { httpOnly: true })
              .json({ 성공: "로그인" });
          });
        } else {
          return res.status(400).json({ 결과: "로그인 실패" });
        }
      }
    });
  }
});

router.get("/logout", auth, async (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { httpOnly: true })
    .json({ 성공: "로그아웃" });
});

router.post("/check", auth, async (req, res) => {
  const id = req.payload.id;
  const password = req.body.password;
  if (id && password) {
    User.findOne({
      where: { id: id },
    }).then((info) => {
      if (info === null) {
        return res.status(403).json({ 결과: "탈퇴한 계정입니다" });
      } else {
        const match = bcrypt.compareSync(password, info.password);
        if (match) {
          return res.status(200).json({ 성공: "비밀번호 맞음" });
        } else {
          return res.status(400).json({ 결과: "비밀번호 틀림" });
        }
      }
    });
  }
});
module.exports = router;
