const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const {
	validateLogin,
	validateRegister,
} = require("../middleware/validateForm");

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

module.exports = router;
