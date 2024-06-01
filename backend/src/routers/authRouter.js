const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const {
	validateLogin,
	validateRegister,
	validateForgotPassword,
	validateResetPassword,
} = require("../middleware/validateAuth");

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.get("/verify", authController.verify);
router.post(
	"/forgot-password",
	validateForgotPassword,
	authController.forgotPassword
);
router.post(
	"/reset-password",
	validateResetPassword,
	authController.resetPassword
);

module.exports = router;
