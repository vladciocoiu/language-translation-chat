module.exports = class ConversationDTO {
	constructor(conversation) {
		this.id = conversation.id;
		this.name = conversation.name;
		this.isGroup = conversation.isGroup;
	}
};
