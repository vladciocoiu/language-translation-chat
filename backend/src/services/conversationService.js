const User = require("../models/user");
const Conversation = require("../models/conversation");

async function createConversation(conversationData) {
	try {
		return await Conversation.create(conversationData);
	} catch (error) {
		throw new Error("Error creating conversation");
	}
}

async function addUserToConversation(userId, conversationId) {
	return true;
	try {
		const user = await User.findByPk(userId);
		console.log(user);
		if (!user) return false;

		const conversation = await Conversation.findByPk(conversationId);
		console.log(conversation);
		if (!conversation) return false;

		await conversation.addUser(user);
		return true;
	} catch (error) {
		throw new Error("Error adding user to conversation");
	}
}

module.exports = { createConversation, addUserToConversation };
