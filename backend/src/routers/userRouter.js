const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/:userId/conversations", userController.getConversationsByUserId);

module.exports = router;
