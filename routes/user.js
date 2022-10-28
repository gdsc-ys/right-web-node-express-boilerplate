const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const STATUS_CODE = require("../utils/status");

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
    return res.status(STATUS_CODE.Created).json(value);
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Desc: "Required parameter : { id, password, email, part }",
    });
  }
});

router.get("/", auth, async (req, res) => {
  const id = req.payload.id;
  if (id) {
    User.findOne({
      where: { id: id },
    }).then((info) => {
      if (info === null) {
        return res.status(STATUS_CODE.NotFound).json({
          Code: "404 (Not Found)",
          Desc: "Requested ID not found",
        });
      } else {
        delete info.dataValues.password;
        delete info.dataValues._previousDataValues;
        return res.status(STATUS_CODE.OK).json(info);
      }
    });
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Desc: "Required parameter : { id }",
    });
  }
});

router.patch("/", auth, async (req, res) => {
  const value = req.body;
  const id = req.payload.id;

  if ((value.password || value.email || value.part) && id) {
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

    return res
      .status(STATUS_CODE.NoContent)
      .json({ Code: "204 (No Content)", Desc: "Update Success" });
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Desc: "Required parameter : { id, (password or email or part)}",
    });
  }
});

router.delete("/", auth, async (req, res) => {
  const id = req.payload.id;
  if (id) {
    User.destroy({
      where: {
        id: id,
      },
    }).then((info) => {
      if (info === 0) {
        return res.status(STATUS_CODE.NotFound).json({
          Code: "404 (Not Found)",
          Desc: "Requested ID not found",
        });
      } else {
        return res
          .status(STATUS_CODE.NoContent)
          .cookie("token", "", { httpOnly: true })
          .json({ Code: "204 (No Content)", Desc: "Deletion success" });
      }
    });
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Desc: "Required parameter : { id }",
    });
  }
});

router.get("/part/:part", async (req, res) => {
  const part = req.params.part;
  if (part) {
    User.findAll({
      where: {
        part: part,
      },
      attributes: ["id", "email"],
    }).then((info) => {
      if (info === 0) {
        return res.status(STATUS_CODE.NotFound).json({
          Code: "404 (Not Found)",
          Desc: "Requested part not found",
        });
      } else {
        return res.status(STATUS_CODE.OK).json(info);
      }
    });
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Desc: "Required parameter : { part }",
    });
  }
});

router.get("/check", async (req, res) => {
  const id = req.query.id;
  const email = req.query.email;
  if (id || email) {
    if (id) {
      User.findOne({
        where: { id: id },
      }).then((info) => {
        if (info === null) {
          return res.status(STATUS_CODE.OK).json({
            Code: "200 (OK)",
            Desc: "Requested ID available",
          });
        } else {
          return res.status(STATUS_CODE.Conflict).json({
            Code: "409 (Conflict)",
            Desc: "Requested ID already exists",
          });
        }
      });
    }

    if (email) {
      User.findOne({
        where: { email: email },
      }).then((info) => {
        if (info === null) {
          return res
            .status(STATUS_CODE.OK)
            .json({ Code: "200 (OK)", Desc: "Requested Email available" });
        } else {
          return res
            .status(STATUS_CODE.Conflict)
            .json({
              Code: "409 (Conflict)",
              Desc: "Requested ID already exists",
            });
        }
      });
    }
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Desc: "Required parameter : { (id or email) }",
    });
  }
});
module.exports = router;
