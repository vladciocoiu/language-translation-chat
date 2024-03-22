const express = require("express");

const authRouter = require("./authRoutes");

const router = express.Router({ mergeParams: true });

router.use("/users", authRouter);

module.exports = router;
