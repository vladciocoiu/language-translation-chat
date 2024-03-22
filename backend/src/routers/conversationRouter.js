const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversationController");

router.post("/", conversationController.createConversation);
router.post(
	"/:conversationId/users",
	conversationController.addUserToConversation
);

module.exports = router;
