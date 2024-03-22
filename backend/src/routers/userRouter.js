const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversationController");

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

module.exports = router;
