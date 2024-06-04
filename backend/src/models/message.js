const { DataTypes, literal } = require("sequelize");

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
	createdAt: {
		type: DataTypes.DATE(3),
		allowNull: false,
		defaultValue: literal("CURRENT_TIMESTAMP(3)"),
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
