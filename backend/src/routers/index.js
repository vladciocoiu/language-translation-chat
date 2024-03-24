const express = require("express");

const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const conversationRouter = require("./conversationRouter");
const messageRouter = require("./messageRouter");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router({ mergeParams: true });

router.use("/auth", authRouter);
router.use("/users", verifyToken, userRouter);
router.use("/conversations", verifyToken, conversationRouter);
router.use("/messages", verifyToken, messageRouter);

module.exports = router;
