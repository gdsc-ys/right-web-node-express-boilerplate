const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const boardRouter = require("./board");
const authRouter = require("./auth");

router.use("/user", userRouter);
router.use("/board", boardRouter);
router.use("/auth", authRouter);

module.exports = router;
