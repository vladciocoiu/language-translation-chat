const Message = require("../models/message");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const DetectLanguage = require("detectlanguage");
const axios = require("axios");

require("dotenv").config();

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
		console.log(error);

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
		let conversation = await Conversation.findOne({
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
			conversation = await Conversation.create({ isGroup: false });
			await conversation.addUser(senderId);
			await conversation.addUser(receiverId);
		}

		const message = await createMessage({
			text,
			senderId,
			conversationId: conversation.id,
		});

		const DBMessage = await Message.findByPk(message.id, {
			include: User,
		});

		return new MessageDTO(DBMessage.dataValues);
	} catch (error) {
		throw new Error("Error sending direct message");
	}
}

async function createMessageInConversation(messageData) {
	const msg = await createMessage(messageData);

	if (!msg) return false;

	const message = await Message.findByPk(msg.id, {
		include: User,
	});

	return new MessageDTO(message.dataValues);
}

async function getMessagesByReceiverId(senderId, receiverId, offset, limit) {
	let conversation;
	try {
		conversation = await Conversation.findOne({
			where: {
				isGroup: false,
			},
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
	} catch (err) {
		throw new Error("Error fetching conversation by receiver id");
	}

	if (!conversation) return [];

	let messages;
	try {
		messages = await getMessagesByConversationId(conversation.id, offset, limit);
	} catch (err) {
		throw new Error("Error fetching conversation by receiver id");
	}

	if (!messages) return [];

	return messages;
}

// detect language of message
// first try to detect language using detectlanguage API
// if it fails, consider the language of the sender
async function detectMessageLanguage(messageId) {
	const detectlanguage = new DetectLanguage(process.env.DETECTLANGUAGE_API_KEY);

	const message = await Message.findByPk(messageId);
	if (!message) return false;

	try {
		const response = await detectlanguage.detectCode(message.text);
		if (!response) throw new Error("Error detecting language from API.");
		return JSON.stringify(response).replace(/"/g, "");
	} catch (error) {
		try {
			const sender = await User.findByPk(message.senderId);
			console.log(
				`Failed to detect language for messageId=${message.id}. Will consider it as ${sender.language}.`
			);
			return sender.language;
		} catch (error) {
			throw new Error("Error fetching sender by message id");
		}
	}
}

async function translateMessage(messageId, targetLanguage, messageLanguage) {
	const message = await Message.findByPk(messageId);
	if (!message) return false;

	// if the message is already in the target language, no need to translate
	if (messageLanguage === targetLanguage) return message.text;

	try {
		const url = `https://api.mymemory.translated.net/get?q=${message.text}&langpair=${messageLanguage}|${targetLanguage}&de=${process.env.EMAIL_USER}`;
		const response = await axios.get(url);
		const translatedText = response.data.responseData.translatedText;
		return translatedText;
	} catch (error) {
		console.log(error);
		throw new Error("Error translating message");
	}
}

module.exports = {
	createMessage,
	deleteMessage,
	updateMessage,
	getMessagesByConversationId,
	isUserSenderOfMessage,
	sendDirectMessage,
	createMessageInConversation,
	getMessagesByReceiverId,
	translateMessage,
	detectMessageLanguage,
};
