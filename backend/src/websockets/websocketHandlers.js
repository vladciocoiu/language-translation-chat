const { getConversationUsers } = require("../services/conversationService");
const WebSocket = require("ws");

const activeUsers = new Map();

const handleConnection = (ws, user, wss) => {
	const userId = user.userId;
	activeUsers.set(userId, ws);

	console.log(`User ${userId} connected`);

	ws.on("message", (message) => {
		handleMessage(userId, message, wss);
	});

	ws.on("close", () => {
		console.log(`User ${userId} disconnected`);
		activeUsers.delete(userId);
	});
};

const handleMessage = async (userId, message, wss) => {
	const parsedMessage = JSON.parse(message);
	console.log(
		`Received message from senderId=${userId} messageId=${parsedMessage.id}`
	);

	const conversationId = parsedMessage.conversationId;
	const users = await getConversationUsers(conversationId);
	const recipients = users.filter((recipient) => recipient.id !== userId);

	recipients.forEach((recipient) => {
		if (activeUsers.has(recipient.id)) {
			const recipientSocket = activeUsers.get(recipient.id);
			if (recipientSocket.readyState === WebSocket.OPEN) {
				recipientSocket.send(JSON.stringify(message));
			}
			console.log(`Sent messageId=${parsedMessage.id} to userId=${recipient.id}`);
		}
	});
};

module.exports = { handleConnection };
