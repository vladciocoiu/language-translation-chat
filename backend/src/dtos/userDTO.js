module.exports = class UserDTO {
	constructor(user) {
		this.id = user.id;
		this.name = user.name;
		this.email = user.email;
		this.language = user.language;
		this.profilePicture = user.profilePicture;
	}
};
