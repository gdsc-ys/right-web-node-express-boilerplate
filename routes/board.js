const express = require("express");
const router = express.Router();

const Board = require("../models/Board");
const User = require("../models/User");
const auth = require("../middleware/auth");
const STATUS_CODE = require("../utils/status");

router.post("/", auth, async (req, res) => {
  const id = req.payload.id;
  const value = req.body;

  if (value.title && value.body) {
    Board.create({
      title: value.title,
      body: value.body,
      user_id: id,
    });
    return res.status(STATUS_CODE.OK).json(value);
  }
});

router.get("/", async (req, res) => {
  Board.findAll().then((info) => {
    return res.status(STATUS_CODE.OK).json(info);
  });
});

router.get("/:id", async (req, res) => {
  const value = req.params;
  if (value.id) {
    Board.findOne({
      where: { id: value.id },
    }).then((info) => {
      if (info === null) {
        return res.status(STATUS_CODE.NotFound).json({
          Code: "404 (Not Found)",
          Desc: "Requested user not found.",
        });
      } else {
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

router.patch("/:id", auth, async (req, res) => {
  const value = req.body;
  const id = req.params.id;
  const user_id = req.payload.id;
  if (id && user_id && (value.title || value.body)) {
    Board.findOne({
      where: { id: id },
    }).then((info) => {
      if (info === null) {
        return res.status(STATUS_CODE.NotFound).json({
          Code: "404 (Not Found)",
          Desc: "Requested user not found.",
        });
      }
      if (info.user_id !== user_id) {
        return res.status(STATUS_CODE.Forbidden).json({
          Code: "403 (Forbidden)",
          Desc: "Modification Failed. Please check your permission.",
        });
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

      return res.status(STATUS_CODE.NoContent).json({
        Code: "204 (No Content)",
        Desc: "Title update successful",
      });
    });
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Desc: "Required parameter : { id, user_id, (title or body) }",
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const user_id = req.payload.id;
  if (id && user_id) {
    Board.findOne({
      where: { id: id },
    }).then((info) => {
      if (info === null) {
        return res.status(STATUS_CODE.NotFound).json({
          Code: "404 (Not Found)",
          Desc: "Requested ID not found",
        });
      }
      if (info.user_id !== user_id) {
        return res.status(STATUS_CODE.Forbidden).json({
          Code: "403 (Forbidden)",
          Desc: "Check your userID and ID",
        });
      }
      Board.destroy({
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
          return res.status(STATUS_CODE.NoContent).json({
            Code: "204 (No Content)",
            Desc: "Delete success",
          });
        }
      });
    });
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Desc: "Required parameter : { id, user_id }",
    });
  }
});

router.get("/user/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  if (user_id) {
    User.findOne({ where: { id: user_id } }).then((info) => {
      if (info == null) {
        return res.status(STATUS_CODE.NotFound).json({
          Code: "404 (Not Found)",
          Desc: "Required parameter : { user_id }",
        });
      } else {
        Board.findAll({ where: { user_id: user_id } }).then((info) => {
          return res.status(STATUS_CODE.OK).json(info);
        });
      }
    });
  } else {
    return res.status(STATUS_CODE.BadRequest).json({
      Code: "400 (Bad Request)",
      Desc: "Required parameter : { user_id }",
    });
  }
});

router.get("/part/:part", async (req, res) => {
  //TODO: Change Status Code by Action and Response!
  return res.status(STATUS_CODE.Accepted).json({
    Code: "202 (Accepted)",
    Desc: "Request accepted",
  });
  //조인을 모르겠음 죽겠다
});

module.exports = router;
