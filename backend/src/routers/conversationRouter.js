const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversationController");

const {
	validateAddUserToConversation,
	validateCreateMessage,
	validateUpdateConversation,
	validateCreateConversation,
} = require("../middleware/validateConversationReq");

const { verifyUserInConversation } = require("../middleware/verifyUser");

router.post(
	"/",
	validateCreateConversation,
	conversationController.createConversation
);
router.put(
	"/:conversationId",
	validateUpdateConversation,
	verifyUserInConversation,
	conversationController.updateConversation
);
router.delete(
	"/:conversationId",
	verifyUserInConversation,
	conversationController.deleteConversation
);

router.post(
	"/:conversationId/users",
	validateAddUserToConversation,
	verifyUserInConversation,
	conversationController.addUserToConversation
);

router.delete(
	"/:conversationId/users/:userId",
	verifyUserInConversation,
	conversationController.removeUserFromConversation
);

router.get(
	"/:conversationId/messages",
	verifyUserInConversation,
	conversationController.getMessagesByConversationId
);
router.post(
	"/:conversationId/messages",
	validateCreateMessage,
	verifyUserInConversation,
	conversationController.createMessage
);

module.exports = router;
