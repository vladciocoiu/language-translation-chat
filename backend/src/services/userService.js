const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

require("dotenv").config();

const User = require("../models/user");
const Conversation = require("../models/conversation");

const ConversationDTO = require("../dtos/conversationDTO");
const UserDTO = require("../dtos/userDTO");

async function sendVerificationEmail(user) {
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
		subject: "Verify Your Email",
		text: `Click this link to verify your email: ${process.env.FRONTEND_URL}/verify?token=${user.verificationToken}`,
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

	try {
		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

function generateVerificationToken() {
	const uniqueID = uuidv4();
	const hash = crypto.createHash("sha256").update(uniqueID).digest("hex");
	return hash.slice(0, 32);
}

async function createUser(userData) {
	const user = { ...userData, verificationToken: generateVerificationToken() };
	try {
		return await User.create(user);
	} catch (error) {
		console.log(error);
		throw new Error("Error creating user");
	}
}

async function getUserByEmail(email) {
	try {
		return await User.findOne({ where: { email } });
	} catch (error) {
		console.log(error);
		throw new Error("Error fetching user by email");
	}
}

async function getUserByVerificationToken(token) {
	try {
		return await User.findOne({ where: { verificationToken: token } });
	} catch (error) {
		throw new Error("Error fetching user by verification token");
	}
}

async function getUserByResetToken(token) {
	try {
		return await User.findOne({ where: { passwordResetToken: token } });
	} catch (error) {
		throw new Error("Error fetching user by reset token");
	}
}

async function getConversationsByUserId(userId) {
	try {
		const result = await User.findByPk(userId, {
			include: {
				model: Conversation,
				include: User,
			},
		});
		return result.dataValues.Conversations.map(
			(conversation) => new ConversationDTO(conversation.dataValues)
		);
	} catch (error) {
		throw new Error("Error fetching conversations by user id");
	}
}

async function getUsersByNameOrEmail(query, userId) {
	try {
		const result = await User.findAll({
			where: {
				[Op.and]: [
					{
						[Op.or]: [
							{ name: { [Op.like]: `%${query}%` } },
							{ email: { [Op.like]: `%${query}%@%` } },
							{ email: query },
						],
					},
					{
						id: { [Op.not]: userId },
					},
					{
						isVerified: true,
					},
				],
			},
		});
		return result.map((user) => new UserDTO(user.dataValues));
	} catch (error) {
		throw new Error("Error fetching users by name or email");
	}
}

async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}

async function updateUser(userId, userData) {
	const fieldsToUpdate = ["name", "language", "profilePicture"];
	const filteredUserData = Object.fromEntries(
		Object.entries(userData).filter(
			([key, value]) => fieldsToUpdate.includes(key) && value != null
		)
	);
	if (userData.password) {
		filteredUserData.password = await hashPassword(userData.password);
	}

	try {
		const [numberOfAffectedRows] = await User.update(filteredUserData, {
			where: {
				id: userId,
				isVerified: true,
			},
		});
		if (numberOfAffectedRows === 0) return false;

		const newUser = await User.findByPk(userId);
		return new UserDTO(newUser.dataValues);
	} catch (error) {
		throw new Error("Error updating user");
	}
}

// helper for verifyUser middleware
async function doesUserExist(userId) {
	try {
		const user = await User.findByPk(userId);
		return !!user;
	} catch (error) {
		throw new Error("Error checking if user exists");
	}
}

async function getUserById(userId) {
	try {
		const user = await User.findByPk(userId);
		return new UserDTO(user.dataValues);
	} catch (error) {
		throw new Error("Error fetching user by id");
	}
}

module.exports = {
	createUser,
	getUserByEmail,
	getUserByVerificationToken,
	getUserByResetToken,
	getUsersByNameOrEmail,
	getConversationsByUserId,
	updateUser,
	getUserById,
	doesUserExist,
	sendVerificationEmail,
	hashPassword,
	sendResetEmail,
};
