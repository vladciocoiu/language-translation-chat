const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = require("./user");
const Conversation = require("./conversation");

const Message = sequelize.define("Message", {
	text: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

User.hasMany(Message, {
	onDelete: "CASCADE",
	foreignKey: "senderId",
});
Message.belongsTo(User, {
	onDelete: "CASCADE",
	foreignKey: "senderId",
});

Message.belongsTo(Conversation, {
	onDelete: "CASCADE",
	foreignKey: "conversationId",
});
Conversation.hasMany(Message, {
	onDelete: "CASCADE",
	foreignKey: "conversationId",
});

// Sync the model with the database (creates the table if it doesn't exist)
(async () => {
	try {
		await Message.sync();
		console.log("Message table synced");
	} catch (error) {
		console.error("Error syncing Message table: ", error);
	}
})();

module.exports = Message;
