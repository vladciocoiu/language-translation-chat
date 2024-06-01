const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = sequelize.define("User", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	isVerified: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	verificationToken: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	passwordResetToken: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	passwordResetTokenExpiry: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	language: {
		type: DataTypes.ENUM,
		values: ["en", "fr", "it", "ro"],
		allowNull: false,
		defaultValue: "en",
	},
	profilePicture: {
		type: DataTypes.STRING,
	},
});

// Sync the model with the database (creates the table if it doesn't exist)
(async () => {
	try {
		await User.sync();
		console.log("User table synced");
	} catch (error) {
		console.error("Error syncing User table: ", error);
	}
})();

module.exports = User;
