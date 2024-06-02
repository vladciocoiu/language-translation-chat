const {
	deleteMessage,
	updateMessage,
	translateMessage,
	detectMessageLanguage,
} = require("../services/messageService");

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
	const { text } = req.validatedPayload;

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

exports.translateMessage = async (req, res) => {
	const { messageId } = req.params;
	const { targetLanguage } = req.body;

	let originalLanguage;
	try {
		originalLanguage = await detectMessageLanguage(messageId);
	} catch (err) {
		return res
			.status(400)
			.json({ error: `Cannot detect message language: ${err}` });
	}

	try {
		const translation = await translateMessage(
			messageId,
			targetLanguage,
			originalLanguage
		);
		res.json(translation);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};
