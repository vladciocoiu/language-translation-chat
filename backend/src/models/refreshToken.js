const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const RefreshToken = sequelize.define("RefreshToken", {
	hash: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = RefreshToken;
