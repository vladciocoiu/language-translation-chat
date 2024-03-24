const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const { validateUpdateMessage } = require("../middleware/validateMessageReq");
const { verifyMessageSender } = require("../middleware/verifyUser");

router.delete(
	"/:messageId",
	verifyMessageSender,
	messageController.deleteMessage
);
router.put(
	"/:messageId",
	validateUpdateMessage,
	verifyMessageSender,
	messageController.updateMessage
);

module.exports = router;
