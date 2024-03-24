const {
	getConversationsByUserId,
	getUsersByNameOrEmail,
	updateUser,
} = require("../services/userService");

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

exports.getUsersByNameOrEmail = async (req, res) => {
	// get info from req query
	const { query } = req.query;

	// get users by name or email
	let users;
	try {
		users = await getUsersByNameOrEmail(query);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!users) return res.status(400).json({ error: "No users found." });

	res.json({ users });
};

exports.updateUser = async (req, res) => {
	// get info from req params
	const { userId } = req.params;

	// get info from req body (only name for now)
	const { name } = req.validatedPayload;

	// update user
	let success;
	try {
		success = await updateUser(userId, { name });
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!success) return res.status(400).json({ error: "User not found." });

	res.json({ success: true });
};
