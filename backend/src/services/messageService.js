const Message = require("../models/message");
const User = require("../models/user");
const Conversation = require("../models/conversation");

const MessageDTO = require("../dtos/messageDTO");

async function createMessage(messageData) {
	const { text, senderId, conversationId } = messageData;

	if (!text || !senderId || !conversationId) return false;

	// resources don't exist
	const user = await User.findByPk(senderId);
	if (!user) return false;

	const conversation = await Conversation.findByPk(conversationId);
	if (!conversation) return false;

	// user is not in conversation
	const isUserInConversation = await conversation.hasUser(user);
	if (!isUserInConversation) return false;

	try {
		return await Message.create(messageData);
	} catch (error) {
		throw new Error("Error creating message");
	}
}

async function deleteMessage(messageId) {
	try {
		const message = await Message.findByPk(messageId);
		if (!message) return false;

		await message.destroy();
		return true;
	} catch (error) {
		throw new Error("Error deleting message");
	}
}

async function updateMessage(messageId, messageData) {
	try {
		const message = await Message.findByPk(messageId);
		if (!message) return false;

		await message.update(messageData);
		return true;
	} catch (error) {
		throw new Error("Error updating message");
	}
}

async function getMessagesByConversationId(conversationId, offset, limit) {
	const conversation = await Conversation.findByPk(conversationId);
	if (!conversation) return false;

	try {
		const result = await Message.findAll({
			where: { conversationId },
			include: User,
			offset: parseInt(offset),
			limit: parseInt(limit),
		});

		return result.map((message) => new MessageDTO(message.dataValues));
	} catch (error) {
		throw new Error("Error fetching messages by conversation id: ", error);
	}
}

module.exports = {
	createMessage,
	deleteMessage,
	updateMessage,
	getMessagesByConversationId,
};
