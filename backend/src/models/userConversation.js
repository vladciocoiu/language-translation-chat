const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = require("./user");

const Conversation = require("./conversation");

const UserConversation = sequelize.define("UserConversation", {});

Conversation.belongsToMany(User, {
	through: UserConversation,
});

User.belongsToMany(Conversation, {
	through: UserConversation,
});

// Sync the model with the database (creates the table if it doesn't exist)
(async () => {
	try {
		await UserConversation.sync();
		console.log("UserConversation table synced");
	} catch (error) {
		console.error("Error syncing UserConversation table: ", error);
	}
})();

module.exports = UserConversation;
