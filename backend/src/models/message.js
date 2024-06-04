const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = require("./user");
const Conversation = require("./conversation");

const Message = sequelize.define("Message", {
	text: {
		type: DataTypes.STRING(255),
		allowNull: true,
	},
	image: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});

if (User) {
	User.hasMany(Message, {
		onDelete: "CASCADE",
		foreignKey: "senderId",
	});
	Message.belongsTo(User, {
		onDelete: "CASCADE",
		foreignKey: "senderId",
	});
}

if (Conversation) {
	Message.belongsTo(Conversation, {
		onDelete: "CASCADE",
		foreignKey: "conversationId",
	});
	Conversation.hasMany(Message, {
		onDelete: "CASCADE",
		foreignKey: "conversationId",
	});
}

module.exports = Message;
