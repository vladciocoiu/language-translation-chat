const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversationController");

router.post("/", conversationController.createConversation);
router.put("/:conversationId", conversationController.updateConversation);
router.delete("/:conversationId", conversationController.deleteConversation);

router.post(
	"/:conversationId/users",
	conversationController.addUserToConversation
);

router.delete(
	"/:conversationId/users/:userId",
	conversationController.removeUserFromConversation
);

module.exports = router;
