const express = require("express");

const authRouter = require("./authRouter");
const conversationRouter = require("./conversationRouter");

const router = express.Router({ mergeParams: true });

router.use("/users", authRouter);
router.use("/conversations", conversationRouter);

module.exports = router;
