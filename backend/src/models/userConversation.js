const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = require("./user");

const Conversation = require("./conversation");

const UserConversation = sequelize.define("UserConversation", {});

if (User && Conversation) {
	Conversation.belongsToMany(User, {
		through: UserConversation,
	});

	User.belongsToMany(Conversation, {
		through: UserConversation,
	});
}

module.exports = UserConversation;
