const Sequelize = require("sequelize");

require("dotenv").config(); // Load .env file

// Create a Sequelize instance
const sequelize = new Sequelize({
	host: process.env.DB_HOST,
	username: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	dialect: "mysql",
});

module.exports = sequelize;
