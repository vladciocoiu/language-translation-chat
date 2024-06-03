const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");

async function hash(password) {
	return await bcrypt.hash(password, 10);
}
function hashToken(token) {
	return crypto.createHash("sha256").update(token).digest("hex");
}

async function register(name, email, password) {
	const existingUser = await User.findOne({ where: { email } });
	if (existingUser) return false;

	const hashedPassword = await hash(password);

	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		verificationToken: generateVerificationToken(),
	});
	return user;
}

async function login(email, password) {
	const user = await User.findOne({ where: { email } });

	if (!user) return false;

	if (!user.isVerified) return false;

	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword) return false;

	const accessToken = generateAccessToken(user.id);
	const refreshToken = generateRefreshToken(user.id);
	const hashedToken = hashToken(refreshToken);
	await RefreshToken.create({ hash: hashedToken });

	return {
		accessToken,
		refreshToken,
		userId: user.id,
		email: user.email,
		language: user.language,
	};
}

async function verify(token) {
	const user = await User.findOne({ where: { verificationToken: token } });
	if (!user) return false;

	await user.update({ isVerified: true });

	return true;
}

async function forgotPassword(email) {
	const user = await User.findOne({ where: { email } });
	if (!user) return false;

	const passwordResetToken = crypto.randomBytes(32).toString("hex");
	const passwordResetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

	await user.update({ passwordResetToken, passwordResetTokenExpiry });

	const success = await sendResetEmail(user.id);
	return success;
}

async function resetPassword(token, password) {
	const user = await User.findOne({ where: { passwordResetToken: token } });
	if (!user) return false;

	if (user.passwordResetTokenExpiry < Date.now()) return false;

	const hashedPassword = await hash(password);
	await user.update({
		password: hashedPassword,
		passwordResetToken: null,
		passwordResetTokenExpiry: null,
	});
	return true;
}

async function sendVerificationEmail(email, verificationToken) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Verify Your Email",
		text: `Click this link to verify your email: ${process.env.FRONTEND_URL}/verify?token=${verificationToken}`,
	};

	try {
		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		return false;
	}
}

const sendResetEmail = async (userId) => {
	const user = await User.findByPk(userId);
	if (!user) return false;

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: user.email,
		subject: "Reset Your Password",
		text: `Click this link to reset your password: ${process.env.FRONTEND_URL}/reset?token=${user.passwordResetToken}`,
	};

	await transporter.sendMail(mailOptions);
	return true;
};

function generateVerificationToken() {
	const uniqueID = uuidv4();
	const hash = crypto.createHash("sha256").update(uniqueID).digest("hex");
	return hash.slice(0, 32);
}

const generateAccessToken = (userId) =>
	jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "600s" });

const generateRefreshToken = (userId) =>
	jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "30d",
	});

async function logout(refreshToken) {
	const hashedToken = hashToken(refreshToken);
	const dbToken = await RefreshToken.findOne({
		where: { hash: hashedToken },
	});
	if (dbToken) {
		await dbToken.destroy();
		return true;
	}
	return false;
}

async function refresh(refreshToken) {
	const hashedToken = hashToken(refreshToken);
	const dbToken = await RefreshToken.findOne({
		where: { hash: hashedToken },
	});

	if (!dbToken) return false;

	let verified;
	try {
		verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const accessToken = generateAccessToken(verified.userId);
		const newRefreshToken = generateRefreshToken(verified.userId);
		const newHashedToken = hashToken(newRefreshToken);

		await dbToken.update({ hash: newHashedToken });

		return { accessToken, refreshToken: newRefreshToken };
	} catch (err) {
		return false;
	}
}

module.exports = {
	register,
	login,
	verify,
	hash,
	forgotPassword,
	resetPassword,
	sendVerificationEmail,
	sendResetEmail,
	generateVerificationToken,
	generateAccessToken,
	logout,
	refresh,
};
