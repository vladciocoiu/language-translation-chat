const Conversation = require("../models/conversation");
const {
	createConversation,
	updateConversation,
	deleteConversation,
	addUserToConversation,
	removeUserFromConversation,
} = require("../services/conversationService");

const {
	createMessage,
	getMessagesByConversationId,
} = require("../services/messageService");

exports.createConversation = async (req, res) => {
	// get info from req body
	const { isGroup, name } = req.validatedPayload;

	// save new conversation
	let conversation;
	try {
		conversation = await createConversation({ isGroup, name });
	} catch (err) {
		return res.status(400).json({ error: err });
	}

	res.json({ id: conversation.id });
};

exports.updateConversation = async (req, res) => {
	// get info from req params
	const { conversationId } = req.params;

	// get info from req body
	const { name } = req.validatedPayload;

	// update conversation
	let success;
	try {
		success = await updateConversation(conversationId, { name });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!success) return res.status(400).json({ error: "Conversation not found" });

	res.json({ success: true });
};

exports.deleteConversation = async (req, res) => {
	// get info from req params
	const { conversationId } = req.params;

	// delete conversation
	let success;
	try {
		success = await deleteConversation(conversationId);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!success)
		return res.status(400).json({ error: "Conversation doesn't exist." });

	res.json({ success: true });
};

exports.addUserToConversation = async (req, res) => {
	// get info from req params
	const { conversationId } = req.params;

	// get info from req body
	const { userId } = req.validatedPayload;

	// add user to conversation
	let success;
	try {
		success = await addUserToConversation(userId, conversationId);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!success) return res.status(400).json({ success: false });

	res.json({ success: true });
};

exports.removeUserFromConversation = async (req, res) => {
	// get info from req params
	const { conversationId, userId } = req.params;

	// remove user from conversation
	let success;
	try {
		success = await removeUserFromConversation(userId, conversationId);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!success) return res.status(400).json({ success: false });

	res.json({ success: true });
};

exports.createMessage = async (req, res) => {
	// get info from req params
	const { conversationId } = req.params;

	// get info from req body
	const { text, senderId } = req.validatedPayload;

	// save new message
	let message;
	try {
		message = await createMessage({ text, senderId, conversationId });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!message) return res.status(400).json({ success: false });

	res.json({ id: message.id });
};

exports.getMessagesByConversationId = async (req, res) => {
	// get offset and limit from query params (for pagination)
	const { offset, limit } = req.query;

	// get info from req params
	const { conversationId } = req.params;

	// get messages by conversation id
	let messages;
	try {
		messages = await getMessagesByConversationId(conversationId, offset, limit);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!messages) return res.status(400).json({ success: false });

	res.json({ messages });
};
