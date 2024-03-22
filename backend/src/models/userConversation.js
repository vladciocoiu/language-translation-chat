const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = require("./user");

const Conversation = require("./conversation");

const UserConversation = sequelize.define("UserConversation", {
	userId: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: "id",
		},
	},
	conversationId: {
		type: DataTypes.INTEGER,
		references: {
			model: Conversation,
			key: "id",
		},
	},
});

Conversation.belongsToMany(User, {
	through: UserConversation,
});

User.belongsToMany(Conversation, {
	through: UserConversation,
});

// Sync the model with the database (creates the table if it doesn't exist)
(async () => {
	try {
		await UserConversation.sync({ force: true }); // This will drop the table if it already exists
		console.log("UserConversation table synced");
	} catch (error) {
		console.error("Error syncing UserConversation table: ", error);
	}
})();

module.exports = UserConversation;
