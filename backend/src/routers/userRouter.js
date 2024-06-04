const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const conversationController = require("../controllers/conversationController");
const {
	validateUpdateUser,
	validateSendDM,
} = require("../middleware/validateUserReq");
const { verifyUserId } = require("../middleware/verifyUser");
const {
	uploadProfilePicture,
	uploadMessagePicture,
} = require("../config/fileStorage");

router.get("/", userController.getUsersByNameOrEmail);
router.put(
	"/:userId",
	verifyUserId,
	uploadProfilePicture.single("profilePicture"),
	validateUpdateUser,
	userController.updateUser
);

router.get(
	"/:userId/conversations",
	verifyUserId,
	userController.getConversationsByUserId
);

router.get("/me", userController.getMe);

router.get(
	"/:receiverId/messages",
	conversationController.getMessagesByReceiverId
);

router.post(
	"/:userId/messages",
	uploadMessagePicture.single("image"),
	validateSendDM,
	userController.sendDirectMessage
);

module.exports = router;
