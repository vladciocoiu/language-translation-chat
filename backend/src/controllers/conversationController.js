const Conversation = require("../models/conversation");
const {
	createConversation,
	addUserToConversation,
} = require("../services/conversationService");

exports.createConversation = async (req, res) => {
	// get info from req body
	const { isGroup, name } = req.body;

	// create new conversation object
	const newConversation = {
		isGroup,
		name,
	};

	// save new conversation
	let conversation;
	try {
		conversation = await createConversation(newConversation);
	} catch (err) {
		return res.status(400).json({ error: err });
	}

	res.json({ id: conversation.id });
};

exports.addUserToConversation = async (req, res) => {
	// get info from req params
	const { conversationId } = req.params;

	// get info from req body
	const { userId } = req.body;

	// add user to conversation
	let success; // = await addUserToConversation(userId, conversationId);
	try {
		success = await addUserToConversation(userId, conversationId);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!success) return res.status(400).json({ success: false });

	res.json({ success: true });
};
