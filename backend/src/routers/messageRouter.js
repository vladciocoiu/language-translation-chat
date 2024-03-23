const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

router.delete("/:messageId", messageController.deleteMessage);
router.put("/:messageId", messageController.updateMessage);

module.exports = router;
