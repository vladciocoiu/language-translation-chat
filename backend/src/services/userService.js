const { Op } = require("sequelize");

const User = require("../models/user");
const Conversation = require("../models/conversation");

const ConversationDTO = require("../dtos/conversationDTO");
const UserDTO = require("../dtos/userDTO");

async function createUser(userData) {
	try {
		return await User.create(userData);
	} catch (error) {
		throw new Error("Error creating user");
	}
}

async function getUserByEmail(email) {
	try {
		return await User.findOne({ where: { email } });
	} catch (error) {
		throw new Error("Error fetching user by email");
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
				],
			},
		});
		return result.map((user) => new UserDTO(user.dataValues));
	} catch (error) {
		throw new Error("Error fetching users by name or email");
	}
}

async function updateUser(userId, userData) {
	try {
		const user = await User.findByPk(userId);
		if (!user) return false;

		await user.update(userData);
		return true;
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

module.exports = {
	createUser,
	getUserByEmail,
	getUsersByNameOrEmail,
	getConversationsByUserId,
	updateUser,
	doesUserExist,
};
