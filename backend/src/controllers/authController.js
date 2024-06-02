const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const {
	getUserByEmail,
	getUserByVerificationToken,
	getUserByResetToken,
} = require("../services/userService");

const authService = require("../services/authService");

exports.register = async (req, res) => {
	// get info from req body
	const { name, email, password } = req.validatedPayload;

	// save new user
	let user;
	try {
		user = await authService.register(name, email, password);
		if (!user) return res.status(400).json({ error: "Bad Request" });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	// send verification email
	try {
		const success = await authService.sendVerificationEmail(
			email,
			user.verificationToken
		);
		if (!success) return res.status(500).json({ error: "Error sending email." });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	res.json({ id: user.id });
};

exports.login = async (req, res) => {
	// get info from req body
	const { email, password } = req.validatedPayload;

	let user;
	try {
		user = await authService.login(email, password);
		if (!user) return res.status(400).json({ error: "Invalid credentials." });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	// add token to response header
	res.header("authentication", "Bearer " + user.accessToken);

	res.json(user);
};

exports.verify = async (req, res) => {
	// get info from req query
	const { token } = req.query;

	try {
		const success = await authService.verify(token);
		if (!success) return res.status(400).json({ error: "Invalid token." });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	res.json({ success: true });
};

exports.forgotPassword = async (req, res) => {
	// get info from req body
	const { email } = req.validatedPayload;

	try {
		const success = await authService.forgotPassword(email);
		if (!success) return res.status(400).json({ error: "Invalid email." });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	res.json({ success: true });
};

exports.resetPassword = async (req, res) => {
	// get info from req body
	const { password, token } = req.validatedPayload;

	try {
		const success = await authService.resetPassword(token, password);
		if (!success) return res.status(400).json({ error: "Invalid token." });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	res.json({ success: true });
};
