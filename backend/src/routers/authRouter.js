const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const {
	validateLogin,
	validateRegister,
} = require("../middleware/validateAuth");

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.get("/verify", authController.verify);

module.exports = router;
