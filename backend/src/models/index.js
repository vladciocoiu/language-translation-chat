const User = require("./user");
const RefreshToken = require("./refreshToken");
const Message = require("./message");
const Translation = require("./translation");
const Conversation = require("./conversation");
const UserConversation = require("./userConversation");

const sequelize = require("../config/database");

// Sync all tables at once so there is no error
(async () => {
	try {
		await sequelize.sync();
		console.log("All tables synced");
	} catch (error) {
		console.error("Error syncing tables: ", error);
	}
})();
