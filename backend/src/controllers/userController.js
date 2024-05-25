const {
	getConversationsByUserId,
	getUsersByNameOrEmail,
	updateUser,
	getUserById,
} = require("../services/userService");

const { sendDirectMessage } = require("../services/messageService");

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

	const userId = req.user.userId;

	// get users by name or email
	let users;
	try {
		users = await getUsersByNameOrEmail(query, userId);
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

exports.sendDirectMessage = async (req, res) => {
	const { userId } = req.params;

	const { text } = req.validatedPayload;

	const senderId = req.user.userId;

	let message;
	try {
		message = await sendDirectMessage(senderId, userId, text);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!message)
		return res.status(400).json({ error: "Error sending direct message." });

	res.json({ message });
};

exports.getMe = async (req, res) => {
	const userId = req.user.userId;

	if (!userId) return res.status(403).json({ error: "Forbidden" });

	let user;
	try {
		user = await getUserById(userId);
	} catch (err) {
		return res.status(500).json({ error: err });
	}

	if (!user) return res.status(404).json({ error: "User not found." });

	res.json({ user });
};
