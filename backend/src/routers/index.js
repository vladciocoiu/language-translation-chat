const express = require("express");

const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const conversationRouter = require("./conversationRouter");

const router = express.Router({ mergeParams: true });

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/conversations", conversationRouter);

module.exports = router;
