const UserDTO = require("./userDTO");

module.exports = class ConversationDTO {
	constructor(conversation) {
		this.id = conversation.id;
		this.name = conversation.name;
		this.isGroup = conversation.isGroup;
		this.members = conversation.Users.map((user) => new UserDTO(user.dataValues));
	}
};
