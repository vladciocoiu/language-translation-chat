const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_URL);

const User = sequelize.define("User", {
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
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
});

const RefreshToken = require("./refreshToken");

User.hasMany(RefreshToken, {
	foreignKey: "userId",
	onDelete: "CASCADE",
});

// Sync the model with the database (creates the table if it doesn't exist)
(async () => {
	try {
		await User.sync({ force: true }); // This will drop the table if it already exists
		console.log("User table synced");
	} catch (error) {
		console.error("Error syncing User table: ", error);
	}
})();

module.exports = User;
