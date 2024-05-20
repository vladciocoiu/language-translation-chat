const Conversation = require("../models/conversation");
const {
	createConversation,
	updateConversation,
	deleteConversation,
	addUserToConversation,
	removeUserFromConversation,
} = require("../services/conversationService");

const {
	createMessageInConversation,
	getMessagesByConversationId,
	getMessagesByReceiverId,
} = require("../services/messageService");

// users can manually only create group conversations
exports.createConversation = async (req, res) => {
	// get info from req body
	const { name } = req.validatedPayload;

	const { userId } = req.user;

	// save new conversation
	let conversation;
	try {
		conversation = await createConversation({ isGroup: true, name }, userId);
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

exports.createMessageInConversation = async (req, res) => {
	// get info from req params
	const { conversationId } = req.params;

	// get info from req body
	const { text } = req.validatedPayload;

	const senderId = req.user.userId;

	// save new message
	let message;
	try {
		message = await createMessageInConversation({
			text,
			senderId,
			conversationId,
		});
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!message) return res.status(400).json({ success: false });

	res.json({ message });
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

exports.getMessagesByReceiverId = async (req, res) => {
	// get offset and limit from query params (for pagination)
	const { offset, limit } = req.query;

	const { receiverId } = req.params;

	const senderId = req.user.userId;

	let messages;
	try {
		messages = await getMessagesByReceiverId(senderId, receiverId, offset, limit);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!messages) return res.status(400).json({ success: false });

	res.json({ messages });
};
