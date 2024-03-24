const { isUserInConversation } = require("../services/conversationService");
const { isUserSenderOfMessage } = require("../services/messageService");
const { doesUserExist } = require("../services/userService");

exports.verifyUserInConversation = async (req, res, next) => {
	const { userId } = req.user;
	if (!userId) return res.status(401).json({ error: "Access denied." });

	const userExists = doesUserExist(userId);
	if (!userExists) return res.status(401).json({ error: "User does not exist" });

	const { conversationId } = req.params;

	const userInConversation = await isUserInConversation(userId, conversationId);

	if (!userInConversation)
		return res.status(403).json({ error: "User not in conversation." });
	next();
};

exports.verifyMessageSender = async (req, res, next) => {
	const { userId } = req.user;
	if (!userId) return res.status(401).json({ error: "Access denied." });

	const userExists = doesUserExist(userId);
	if (!userExists) return res.status(401).json({ error: "User does not exist" });

	const { messageId } = req.params;

	const userIsSender = await isUserSenderOfMessage(userId, messageId);

	if (!userIsSender)
		return res.status(403).json({ error: "User not sender of message." });
	next();
};

exports.verifyUserId = (req, res, next) => {
	const tokenUserId = req.user.userId;
	if (!tokenUserId) return res.status(401).json({ error: "Access denied." });

	const userExists = doesUserExist(tokenUserId);
	if (!userExists) return res.status(401).json({ error: "User does not exist" });

	const { userId } = req.params;

	if (userId != tokenUserId)
		return res.status(403).json({ error: "User not authorized." });
	next();
};
