const User = require("../models/user");

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

module.exports = { createUser, getUserByEmail };
