const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Conversation = sequelize.define("Conversation", {
	isGroup: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: true,
		unique: true,
	},
});

// Sync the model with the database (creates the table if it doesn't exist)
(async () => {
	try {
		await Conversation.sync();
		console.log("Conversation table synced");
	} catch (error) {
		console.error("Error syncing Conversation table: ", error);
	}
})();

module.exports = Conversation;
