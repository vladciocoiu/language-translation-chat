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

// helper for validateUser middleware
async function isUserSenderOfMessage(userId, messageId) {
	try {
		const message = await Message.findByPk(messageId);
		if (!message) return false;

		return message.senderId === userId;
	} catch (error) {
		throw new Error("Error checking if user is sender of message");
	}
}

async function sendDirectMessage(senderId, receiverId, text) {
	if (senderId === receiverId) return false;

	try {
		const conversation = await Conversation.findOne({
			where: { isGroup: false },
			include: [
				{
					model: User,
					where: { id: senderId },
				},
				{
					model: User,
					where: { id: receiverId },
				},
			],
		});

		if (!conversation) {
			const newConversation = await Conversation.create({ isGroup: false });
			await newConversation.addUser(senderId);
			await newConversation.addUser(receiverId);
		}

		await createMessage({
			text,
			senderId,
			conversationId: conversation.id,
		});
	} catch (error) {
		throw new Error("Error sending direct message");
	}

	return true;
}

module.exports = {
	createMessage,
	deleteMessage,
	updateMessage,
	getMessagesByConversationId,
	isUserSenderOfMessage,
	sendDirectMessage,
};
