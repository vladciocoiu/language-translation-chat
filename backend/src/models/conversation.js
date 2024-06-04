const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Conversation = sequelize.define("Conversation", {
	isGroup: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING(50),
		allowNull: true,
		unique: true,
	},
});

module.exports = Conversation;
