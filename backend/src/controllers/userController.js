const { getConversationsByUserId } = require("../services/userService");

exports.getConversationsByUserId = async (req, res) => {
	// get info from req params
	const { userId } = req.params;

	// get conversations by user id
	let conversations;
	try {
		conversations = await getConversationsByUserId(userId);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!conversations) return res.status(400).json({ success: false });

	res.json({ conversations });
};
