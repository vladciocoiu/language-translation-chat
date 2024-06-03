const { Op } = require("sequelize");

require("dotenv").config();

const User = require("../models/user");
const Conversation = require("../models/conversation");

const ConversationDTO = require("../dtos/conversationDTO");
const UserDTO = require("../dtos/userDTO");

async function getUserByEmail(email) {
	try {
		const user = await User.findOne({ where: { email } });
		return user;
	} catch (error) {
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

async function updateUser(userId, userData) {
	const fieldsToUpdate = ["name", "language", "profilePicture"];
	const filteredUserData = Object.fromEntries(
		Object.entries(userData).filter(
			([key, value]) => fieldsToUpdate.includes(key) && value != null
		)
	);

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
	getUserByEmail,
	getUserByVerificationToken,
	getUserByResetToken,
	getUsersByNameOrEmail,
	getConversationsByUserId,
	updateUser,
	getUserById,
	doesUserExist,
};
