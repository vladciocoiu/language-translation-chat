const User = require("../models/user");
const Conversation = require("../models/conversation");

async function createUser(userData) {
	try {
		return await User.create(userData);
	} catch (error) {
		throw new Error("Error creating user");
	}
}

async function getUserByEmail(email) {
	try {
		return await User.findOne({ where: { email } });
	} catch (error) {
		throw new Error("Error fetching user by email");
	}
}

async function getConversationsByUserId(userId) {
	try {
		return await User.findByPk(userId, {
			include: Conversation,
		});
	} catch (error) {
		throw new Error("Error fetching conversations by user id");
	}
}

module.exports = { createUser, getUserByEmail, getConversationsByUserId };
