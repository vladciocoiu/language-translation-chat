const { deleteMessage, updateMessage } = require("../services/messageService");

exports.deleteMessage = async (req, res) => {
	// get info from req params
	const { messageId } = req.params;

	// delete message
	let success;
	try {
		success = await deleteMessage(messageId);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!success) return res.status(400).json({ error: "Message not found" });

	res.json({ success: true });
};

exports.updateMessage = async (req, res) => {
	// get info from req params
	const { messageId } = req.params;

	// get info from req body
	const { text } = req.body;

	// update message
	let success;
	try {
		success = await updateMessage(messageId, { text });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!success) return res.status(400).json({ error: "Message not found" });

	res.json({ success: true });
};
