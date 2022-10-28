const express = require("express");
const router = express.Router();

const jwt = require("../utils/token");
const auth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const STATUS_CODE = require("../utils/status");

router.post("/login", async (req, res) => {
  const value = req.body;
  if (value.id) {
    User.findOne({
      where: { id: value.id },
    }).then((info) => {
      if (info === null) {
        return res.status(STATUS_CODE.NotFound).json({
          Code: "404 (Not Found)",
          Desc: "Requested user not found.",
        });
      } else {
        const match = bcrypt.compareSync(value.password, info.password);
        if (match) {
          jwt.sign({ id: info.id, email: info.email }).then((token) => {
            return res
              .status(STATUS_CODE.OK)
              .cookie("token", token.token, { httpOnly: true })
              .json({
                Code: "200 (OK)",
                Desc: "Login success",
              });
          });
        } else {
          return res.status(STATUS_CODE.Unauthorized).json({
            Code: "401 (Unauthorized)",
            Desc: "Check your ID and password",
          });
        }
      }
    });
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Usage: "Required parameter : { id }",
    });
  }
});

router.post("/logout", auth, async (req, res) => {
  return res
    .status(STATUS_CODE.OK)
    .cookie("token", "", { httpOnly: true })
    .json({
      Code: "200 (OK)",
      Desc: "Logout success",
    });
});

router.post("/check", auth, async (req, res) => {
  const id = req.payload.id;
  const password = req.body.password;
  if (id && password) {
    User.findOne({
      where: { id: id },
    }).then((info) => {
      if (info === null) {
        return res.status(STATUS_CODE.NotFound).json({
          Code: "404 (Not Found)",
          Desc: "Requested user not found.",
        });
      } else {
        const match = bcrypt.compareSync(password, info.password);
        if (match) {
          return res.status(STATUS_CODE.OK).json({
            Code: "200 (OK)",
            Desc: "Login success",
          });
        } else {
          return res.status(STATUS_CODE.Unauthorized).json({
            Code: "401 (Unauthorized)",
            Desc: "Check your ID and password",
          });
        }
      }
    });
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Desc: "Required parameter : { id, password }",
    });
  }
});

module.exports = router;
