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

module.exports = Translation;
