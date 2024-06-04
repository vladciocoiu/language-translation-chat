const UserDTO = require("./userDTO");

module.exports = class MessageDTO {
	constructor(message) {
		this.id = message.id;
		this.text = message.text;
		this.createdAt = message.createdAt;
		this.sender = new UserDTO(message.User);
		this.conversationId = message.conversationId;
		this.image = message.image;
	}
};
