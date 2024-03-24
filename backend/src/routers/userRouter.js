const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
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

router.post(
	"/:userId/messages",
	validateSendDM,
	userController.sendDirectMessage
);

module.exports = router;
