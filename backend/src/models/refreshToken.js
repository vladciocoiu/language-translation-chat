const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const RefreshToken = sequelize.define("RefreshToken", {
	hash: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

// Sync the model with the database (creates the table if it doesn't exist)
(async () => {
	try {
		await RefreshToken.sync();
		console.log("RefreshToken table synced");
	} catch (error) {
		console.error("Error syncing RefreshToken table: ", error);
	}
})();

module.exports = RefreshToken;
