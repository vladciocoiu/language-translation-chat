const Message = require("../models/message");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const Translation = require("../models/translation");
const DetectLanguage = require("detectlanguage");
const axios = require("axios");

require("dotenv").config();

const MessageDTO = require("../dtos/messageDTO");
const TranslationDTO = require("../dtos/translationDTO");
const { where } = require("sequelize");

async function createMessage(messageData) {
	const { text, senderId, conversationId, image } = messageData;

	if ((!text && !image) || !senderId || !conversationId) return false;

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
		console.log(error);
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
			order: [["createdAt", "DESC"]],
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

async function sendDirectMessage(senderId, receiverId, text, image) {
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
			image,
		});

		const DBMessage = await Message.findByPk(message.id, {
			include: User,
		});

		return new MessageDTO(DBMessage.dataValues);
	} catch (error) {
		console.log(error);
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

async function getMessageLanguage(messageId) {
	try {
		const translation = await Translation.findOne({ where: { messageId } });
		if (!translation) return false;
		console.log("Found cached language for messageId=", messageId);
		return translation.originalLanguage;
	} catch (error) {
		return false;
	}
}

// detect language of message
// firstly try to get the language from the translation table
// second try to detect language using detectlanguage API
// if it fails, consider the language of the sender

async function detectMessageLanguage(messageId) {
	const language = await getMessageLanguage(messageId);
	if (language) return language;

	const detectlanguage = new DetectLanguage(process.env.DETECTLANGUAGE_API_KEY);

	const message = await Message.findByPk(messageId);
	if (!message || !message.text) return false;

	try {
		const response = await detectlanguage.detectCode(message.text);
		if (!response) throw new Error("Error detecting language from API.");

		const lang = JSON.stringify(response).replace(/"/g, "");

		if (!["en", "fr", "it", "ro"].find((l) => l === lang)) {
			console.log(
				`Language for messageId=${message.id} not supported. Will consider it as ${sender.language}.`
			);
			return sender.language;
		}
		return lang;
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

async function getTranslatedMessage(
	messageId,
	targetLanguage,
	originalLanguage
) {
	const message = await Message.findByPk(messageId);
	if (!message || !message.text) return false;

	// if the message is already in the target language, no need to translate
	if (originalLanguage === targetLanguage) {
		return {
			translatedText: message.text,
			originalLanguage,
			targetLanguage,
		};
	}

	try {
		const translation = await Translation.findOne({
			where: { messageId, targetLanguage },
		});
		if (translation)
			console.log("Found cached translation for messageId=", messageId);
		return translation?.dataValues;
	} catch (error) {
		throw new Error("Error fetching translation");
	}
}

async function translateMessage(messageId, targetLanguage, originalLanguage) {
	// check if the message is already translated
	try {
		const translation = await getTranslatedMessage(
			messageId,
			targetLanguage,
			originalLanguage
		);
		if (translation) return new TranslationDTO(translation);
	} catch (error) {
		console.log("Error fetching translation for messageId=", messageId);
	}

	const message = await Message.findByPk(messageId);

	if (!message || !message.text) return false;

	try {
		const url = `https://api.mymemory.translated.net/get?q=${message.text}&langpair=${originalLanguage}|${targetLanguage}&de=${process.env.EMAIL_USER}`;
		const response = await axios.get(url);
		const translatedText = response.data.responseData.translatedText;

		const translation = await Translation.create({
			messageId,
			translatedText,
			originalLanguage,
			targetLanguage,
		});
		return new TranslationDTO(translation.dataValues);
	} catch (error) {
		console.log(error);
		throw new Error("Error translating message");
	}
}

module.exports = {
	createMessage,
	deleteMessage,
	updateMessage,
	getMessageLanguage,
	getMessagesByConversationId,
	isUserSenderOfMessage,
	sendDirectMessage,
	createMessageInConversation,
	getMessagesByReceiverId,
	getTranslatedMessage,
	translateMessage,
	detectMessageLanguage,
};
