const { expect } = require("chai");
const sinon = require("sinon");
const userService = require("../../src/services/userService");
const User = require("../../src/models/user");
const Message = require("../../src/models/message");
const Conversation = require("../../src/models/conversation");
const ConversationDTO = require("../../src/dtos/conversationDTO");
const UserDTO = require("../../src/dtos/userDTO");
const Translation = require("../../src/models/translation");

describe("User Service", () => {
	beforeEach(() => {
		sinon.stub(Message, "sync").returns(true);
		sinon.stub(User, "sync").returns(true);
		sinon.stub(Conversation, "sync").returns(true);
		sinon.stub(Translation, "sync").returns(true);
	});
	afterEach(() => {
		sinon.restore();
	});
	const mockUser = {
		id: 1,
		email: "john@doe.com",
		name: "John Doe",
		language: "en",
	};
	const mockToken = "token";
	const mockUsersList = [
		{ ...mockUser, id: 1 },
		{ ...mockUser, id: 2 },
		{ ...mockUser, id: 3 },
	];
	const mockConversations = [
		{
			id: 1,
			isGroup: true,
			name: "Group Chat",
			Users: mockUsersList.map((u) => ({ dataValues: u })),
		},
		{
			id: 2,
			isGroup: false,
			name: "Private Chat",
			Users: [
				{ dataValues: { ...mockUser, id: 1 } },
				{ dataValues: { ...mockUser, id: 2 } },
			],
		},
	];
	const userData = { ...mockUser, profilePicture: "/pictures/test.jpg" };

	describe("getUserByEmail", () => {
		it("should return user data when user exists", async () => {
			const callback = sinon.stub(User, "findOne");
			callback.withArgs({ where: { email: mockUser.email } }).returns(mockUser);
			const user = await userService.getUserByEmail(mockUser.email);

			expect(user).to.equal(mockUser);
		});

		it("should return null when user does not exist", async () => {
			const callback = sinon.stub(User, "findOne");
			callback.withArgs({ where: { email: mockUser.email } }).returns(null);

			const user = await userService.getUserByEmail(mockUser.email);
			expect(user).to.equal(null);
		});
	});

	describe("getUserByVerificationToken", () => {
		it("should return user data when user exists", async () => {
			const callback = sinon.stub(User, "findOne");
			callback
				.withArgs({ where: { verificationToken: mockToken } })
				.returns(mockUser);
			const user = await userService.getUserByVerificationToken(mockToken);

			expect(user).to.equal(mockUser);
		});

		it("should return null when user does not exist", async () => {
			const callback = sinon.stub(User, "findOne");
			callback.withArgs({ where: { verificationToken: mockToken } }).returns(null);

			const user = await userService.getUserByVerificationToken(mockToken);
			expect(user).to.equal(null);
		});
	});

	describe("getUserByResetToken", () => {
		it("should return user data when user exists", async () => {
			const callback = sinon.stub(User, "findOne");
			callback
				.withArgs({ where: { passwordResetToken: mockToken } })
				.returns(mockUser);
			const user = await userService.getUserByResetToken(mockToken);

			expect(user).to.equal(mockUser);
		});

		it("should return null when user does not exist", async () => {
			const callback = sinon.stub(User, "findOne");
			callback
				.withArgs({ where: { passwordResetToken: mockToken } })
				.returns(null);

			const user = await userService.getUserByResetToken(mockToken);
			expect(user).to.equal(null);
		});
	});

	describe("getUserById", () => {
		it("should return user dto when user exists", async () => {
			const callback = sinon.stub(User, "findByPk");
			callback.withArgs(mockUser.id).returns({ dataValues: mockUser });
			const user = await userService.getUserById(mockUser.id);

			expect(user).to.eql(new UserDTO(mockUser));
		});

		it("should throw an error when user does not exist", async () => {
			const callback = sinon.stub(User, "findByPk");
			callback.withArgs(mockUser.id).returns(null);
			let err;
			try {
				await userService.getUserById(mockUser.id);
			} catch (error) {
				err = error;
			}
			expect(err).to.be.an("error");
			expect(err.message).to.equal("Error fetching user by id");
		});
	});

	describe("doesUserExist", () => {
		it("should return true when user exists", async () => {
			const callback = sinon.stub(User, "findByPk");
			callback.withArgs(mockUser.id).returns({ dataValues: mockUser });
			const exists = await userService.doesUserExist(mockUser.id);

			expect(exists).to.equal(true);
		});

		it("should return false when user does not exist", async () => {
			const callback = sinon.stub(User, "findByPk");
			callback.withArgs(mockUser.id).returns(null);
			const exists = await userService.doesUserExist(mockUser.id);

			expect(exists).to.equal(false);
		});
	});

	describe("getConversationsByUserId", () => {
		it("should return conversation dtos when user exists", async () => {
			const callback = sinon.stub(User, "findByPk");
			callback
				.withArgs(mockUser.id, {
					include: {
						model: Conversation,
						include: User,
					},
				})
				.returns({
					dataValues: {
						Conversations: mockConversations.map((c) => ({ dataValues: c })),
					},
				});
			const conversations = await userService.getConversationsByUserId(
				mockUser.id
			);

			expect(conversations).to.eql(
				mockConversations.map((c) => new ConversationDTO(c))
			);
		});

		it("should return an empty array when user has no conversations", async () => {
			const callback = sinon.stub(User, "findByPk");
			callback
				.withArgs(mockUser.id, {
					include: {
						model: Conversation,
						include: User,
					},
				})
				.returns({ dataValues: { Conversations: [] } });
			const conversations = await userService.getConversationsByUserId(
				mockUser.id
			);
			expect(conversations).to.eql([]);
		});

		it("should throw an error when user does not exist", async () => {
			const callback = sinon.stub(User, "findByPk");
			callback
				.withArgs(mockUser.id, {
					include: {
						model: Conversation,
						include: User,
					},
				})
				.returns(null);
			let err;
			try {
				await userService.getConversationsByUserId(mockUser.id);
			} catch (error) {
				err = error;
			}
			expect(err).to.be.an("error");
			expect(err.message).to.equal("Error fetching conversations by user id");
		});
	});

	describe("getUsersByNameOrEmail", () => {
		it("should return users when query matches", async () => {
			const query = "John";
			sinon
				.stub(User, "findAll")
				.returns(mockUsersList.map((u) => ({ dataValues: u })));

			const users = await userService.getUsersByNameOrEmail(query, 5);

			expect(users).to.eql(mockUsersList.map((u) => new UserDTO(u)));
		});

		it("should return an empty array when query does not match", async () => {
			const query = "Jane";
			sinon.stub(User, "findAll").returns([]);
			const users = await userService.getUsersByNameOrEmail(query, 5);

			expect(users).to.eql([]);
		});
	});

	describe("updateUser", () => {
		it("should return updated user data when user exists", async () => {
			const callback = sinon.stub(User, "update");
			callback
				.withArgs(
					{
						name: userData.name,
						language: userData.language,
						profilePicture: userData.profilePicture,
					},
					{ where: { id: mockUser.id, isVerified: true } }
				)
				.returns([1]);

			const callback2 = sinon.stub(User, "findByPk");
			callback2.withArgs(mockUser.id).returns({ dataValues: userData });

			const user = await userService.updateUser(mockUser.id, userData);

			expect(user).to.eql(new UserDTO(userData));
		});

		it("should return false when user does not exist", async () => {
			const callback = sinon.stub(User, "update");
			callback
				.withArgs(
					{
						name: userData.name,
						language: userData.language,
						profilePicture: userData.profilePicture,
					},
					{ where: { id: mockUser.id, isVerified: true } }
				)
				.returns([0]);

			const user = await userService.updateUser(mockUser.id, userData);
			expect(user).to.equal(false);
		});
	});
});
