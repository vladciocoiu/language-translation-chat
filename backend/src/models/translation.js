const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Message = require("./message");

const Translation = sequelize.define("Translation", {
	originalLanguage: {
		type: DataTypes.ENUM,
		values: ["en", "fr", "it", "ro"],
		allowNull: false,
	},
	targetLanguage: {
		type: DataTypes.ENUM,
		values: ["en", "fr", "it", "ro"],
		allowNull: false,
	},
	translatedText: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
});

if (Message) {
	Message.hasMany(Translation, { foreignKey: "messageId" });
	Translation.belongsTo(Message, {
		onDelete: "CASCADE",
		foreignKey: "messageId",
	});
}

// Sync the model with the database (creates the table if it doesn't exist)
(async () => {
	try {
		await Translation.sync();
		console.log("Translation table synced");
	} catch (error) {
		console.error("Error syncing Translation table: ", error);
	}
})();

module.exports = Translation;
