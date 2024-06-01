const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {
	getUserByEmail,
	getUserByVerificationToken,
	getUserByResetToken,
	createUser,
	sendVerificationEmail,
	hashPassword,
	sendResetEmail,
} = require("../services/userService");

const generateAccessToken = async (userId) =>
	await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });

exports.register = async (req, res) => {
	// get info from req body
	const { name, email, password } = req.validatedPayload;

	// hash password
	const hash = await hashPassword(password);

	// save new user and send id as json
	let user;
	try {
		user = await createUser({ name, email, password: hash });
	} catch (err) {
		return res.status(400).json({ error: err });
	}

	// send verification email
	try {
		const success = await sendVerificationEmail(user);
		if (!success) return res.status(500).json({ error: "Error sending email." });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	res.json({ id: user.id });
};

exports.login = async (req, res) => {
	// get info from req body
	const { email, password } = req.validatedPayload;

	// check if user exists in db
	let user;
	try {
		user = await getUserByEmail(email);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
	if (!user) return res.status(400).json({ error: "Invalid credentials." });

	if (!user.isVerified)
		return res.status(403).json({ error: "User not verified." });

	// compare password
	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword)
		return res.status(400).json({ error: "Invalid credentials." });

	// generate signed access token
	const accessToken = await generateAccessToken(user.id);

	// add token to response header
	res.header("authentication", "Bearer " + accessToken);

	res.json({ accessToken, userId: user.id, language: user.language });
};

exports.verify = async (req, res) => {
	// get info from req query
	const { token } = req.query;

	// check if token is valid
	let user;
	try {
		user = await getUserByVerificationToken(token);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
	if (!user) return res.status(400).json({ error: "Invalid token." });

	// update user to verified
	let success;
	try {
		success = await user.update({ isVerified: true });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
	if (!success) return res.status(400).json({ error: "User not found." });

	res.json({ success: true });
};

exports.forgotPassword = async (req, res) => {
	// get info from req body
	const { email } = req.validatedPayload;

	// check if user exists in db
	let user;
	try {
		user = await getUserByEmail(email);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
	if (!user) return res.status(400).json({ error: "Invalid email." });

	// generate reset token
	const passwordResetToken = crypto.randomBytes(20).toString("hex");
	const passwordResetTokenExpiry = Date.now() + 3600000; // 1 hour

	// save token to user
	let success;
	try {
		success = await user.update({ passwordResetToken, passwordResetTokenExpiry });
	} catch (err) {
		return res.status(500).json({ error: err });
	}
	if (!success) return res.status(400).json({ error: "User not found." });

	// send reset email
	try {
		const success = await sendResetEmail(user.id);
		if (!success) return res.status(500).json({ error: "Error sending email." });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	res.json({ success: true });
};

exports.resetPassword = async (req, res) => {
	// get info from req body
	const { password, token } = req.validatedPayload;

	// check if token is valid
	let user;
	try {
		user = await getUserByResetToken(token);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
	if (!user) return res.status(400).json({ error: "Invalid token." });

	// check if token is expired
	if (user.passwordResetTokenExpiry < Date.now())
		return res.status(400).json({ error: "Token expired." });

	// hash password
	const hash = await hashPassword(password);

	// save new password
	let success;
	try {
		success = await user.update({
			password: hash,
			passwordResetToken: null,
			passwordResetTokenExpiry: null,
		});
	} catch (err) {
		return res.status(500).json({ error: err });
	}
	if (!success) return res.status(400).json({ error: "User not found." });

	res.json({ success: true });
};
