const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const conversationController = require("../controllers/conversationController");
const {
	validateUpdateUser,
	validateSendDM,
} = require("../middleware/validateUserReq");
const { verifyUserId } = require("../middleware/verifyUser");

router.get("/", userController.getUsersByNameOrEmail);
router.put(
	"/:userId",
	validateUpdateUser,
	verifyUserId,
	userController.updateUser
);

router.get(
	"/:userId/conversations",
	verifyUserId,
	userController.getConversationsByUserId
);

router.get(
	"/:receiverId/messages",
	conversationController.getMessagesByReceiverId
);

router.post(
	"/:userId/messages",
	validateSendDM,
	userController.sendDirectMessage
);

module.exports = router;
