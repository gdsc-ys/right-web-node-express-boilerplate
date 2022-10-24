const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const boardRouter = require("./board");
const authRouter = require("./auth");
const debugRouter = require("./debug");

router.use("/user", userRouter);
router.use("/board", boardRouter);
router.use("/auth", authRouter);
router.use("/debug", debugRouter);

module.exports = router;
