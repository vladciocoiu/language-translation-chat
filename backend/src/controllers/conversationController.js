const Conversation = require("../models/conversation");
const {
	createConversation,
	updateConversation,
	deleteConversation,
	addUserToConversation,
	removeUserFromConversation,
} = require("../services/conversationService");

exports.createConversation = async (req, res) => {
	// get info from req body
	const { isGroup, name } = req.body;

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
	const { name } = req.body;

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
	const { userId } = req.body;

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
