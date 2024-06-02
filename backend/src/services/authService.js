const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../models/user");

async function register(name, email, password) {
	const existingUser = await User.findOne({ where: { email } });
	if (existingUser) return false;

	const hash = await hashPassword(password);

	const user = await User.create({
		name,
		email,
		password: hash,
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

	const accessToken = await generateAccessToken(user.id);
	return {
		accessToken,
		userId: user.id,
		email: user.email,
		language: user.language,
	};
}

async function verify(token) {
	console.log("here ", token);
	const user = await User.findOne({ where: { verificationToken: token } });
	if (!user) return false;

	console.log("here 2");
	await user.update({ isVerified: true });

	console.log("here 3");
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

	const hash = await hashPassword(password);
	await user.update({
		password: hash,
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

async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}

function generateVerificationToken() {
	const uniqueID = uuidv4();
	const hash = crypto.createHash("sha256").update(uniqueID).digest("hex");
	return hash.slice(0, 32);
}

const generateAccessToken = async (userId) =>
	await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });

module.exports = {
	register,
	login,
	verify,
	forgotPassword,
	resetPassword,
	sendVerificationEmail,
	sendResetEmail,
	generateVerificationToken,
	generateAccessToken,
};
