const User = require("../models/user");
const Conversation = require("../models/conversation");

const UserConversation = require("../models/userConversation");
const ConversationDTO = require("../dtos/conversationDTO");

async function createConversation(conversationData, userId) {
	try {
		const conversation = await Conversation.create(conversationData);

		await conversation.addUser(userId);

		const dbConversation = await Conversation.findByPk(conversation.id, {
			include: User,
		});

		return new ConversationDTO(dbConversation.dataValues);
	} catch (error) {
		throw new Error("Error creating conversation");
	}
}

async function updateConversation(conversationId, conversationData) {
	try {
		const conversation = await Conversation.findByPk(conversationId);
		if (!conversation) return false;

		await conversation.update(conversationData);
		return true;
	} catch (error) {
		throw new Error("Error updating conversation");
	}
}

async function deleteConversation(conversationId) {
	try {
		const conversation = await Conversation.findByPk(conversationId);
		if (!conversation) return false;

		await conversation.destroy();
		return true;
	} catch (error) {
		throw new Error("Error deleting conversation");
	}
}

async function addUserToConversation(userId, conversationId) {
	try {
		const user = await User.findByPk(userId);
		if (!user) return false;

		const conversation = await Conversation.findByPk(conversationId);
		if (!conversation || !conversation.isGroup) return false;

		await conversation.addUser(user);
		return true;
	} catch (error) {
		throw new Error("Error adding user to conversation");
	}
}

async function removeUserFromConversation(userId, conversationId) {
	try {
		const user = await User.findByPk(userId);
		if (!user) return false;

		const conversation = await Conversation.findByPk(conversationId);
		if (!conversation || !conversation.isGroup) return false;

		await conversation.removeUser(user);
		return true;
	} catch (error) {
		throw new Error("Error removing user from conversation");
	}
}

// helper for validateUser middleware
async function isUserInConversation(userId, conversationId) {
	try {
		const user = await User.findByPk(userId);
		if (!user) return false;

		const conversation = await Conversation.findByPk(conversationId);
		if (!conversation) return false;

		return await conversation.hasUser(user);
	} catch (error) {
		throw new Error("Error checking if user is in conversation");
	}
}

module.exports = {
	createConversation,
	updateConversation,
	deleteConversation,
	addUserToConversation,
	removeUserFromConversation,
	isUserInConversation,
};
