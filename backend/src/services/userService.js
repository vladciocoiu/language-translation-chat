const User = require("../models/user");
const Conversation = require("../models/conversation");

const ConversationDTO = require("../dtos/conversationDTO");

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
			include: Conversation,
		});
		return result.Conversations.map(
			(conversation) => new ConversationDTO(conversation.dataValues)
		);
	} catch (error) {
		throw new Error("Error fetching conversations by user id");
	}
}

module.exports = { createUser, getUserByEmail, getConversationsByUserId };
