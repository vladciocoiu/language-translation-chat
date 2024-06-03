const { expect } = require("chai");
const sinon = require("sinon");
const conversationService = require("../../src/services/conversationService");
const Message = require("../../src/models/message");
const User = require("../../src/models/user");
const Conversation = require("../../src/models/conversation");
const Translation = require("../../src/models/translation");
const ConversationDTO = require("../../src/dtos/conversationDTO");
const UserConversation = require("../../src/models/userConversation");
const UserDTO = require("../../src/dtos/userDTO");

describe("Conversation Service", () => {
	beforeEach(() => {
		sinon.stub(Message, "sync").returns(true);
		sinon.stub(User, "sync").returns(true);
		sinon.stub(Conversation, "sync").returns(true);
		sinon.stub(Translation, "sync").returns(true);
		sinon.stub(UserConversation, "sync").returns(true);
	});
	afterEach(() => {
		sinon.restore();
	});

	const mockConversation = {
		id: 1,
		name: "Group Chat",
		isGroup: true,
	};
	const mockUser = {
		id: 1,
		email: "john@doe.com",
		name: "John Doe",
		language: "en",
		profilePicture: "/pictures/test.jpg",
	};

	describe("createConversation", () => {
		it("should create a conversation", async () => {
			const conversationData = {
				...mockConversation,
				Users: [{ dataValues: mockUser }],
			};
			sinon
				.stub(Conversation, "create")
				.returns({ ...mockConversation, addUser: (id) => true });
			sinon.stub(Conversation, "findByPk").returns({
				dataValues: conversationData,
			});
			const conversation = await conversationService.createConversation(
				mockConversation,
				1
			);

			expect(conversation).to.eql(new ConversationDTO(conversationData));
		});
	});

	describe("updateConversation", () => {
		it("should update a conversation if it exists", async () => {
			const updateStub = sinon.stub().returns(true);
			sinon
				.stub(Conversation, "findByPk")
				.returns({ ...mockConversation, update: updateStub });
			const result = await conversationService.updateConversation(
				1,
				mockConversation
			);

			expect(updateStub.calledOnce).to.be.true;
			expect(result).to.equal(true);
		});

		it("should return false if conversation does not exist", async () => {
			sinon.stub(Conversation, "findByPk").returns(null);
			const result = await conversationService.updateConversation(
				1,
				mockConversation
			);

			expect(result).to.equal(false);
		});
	});

	describe("deleteConversation", () => {
		it("should return true if it exists", async () => {
			const destroyStub = sinon.stub().returns(true);

			sinon
				.stub(Conversation, "findByPk")
				.returns({ ...mockConversation, destroy: destroyStub });
			const result = await conversationService.deleteConversation(1);

			expect(destroyStub.calledOnce).to.be.true;
			expect(result).to.equal(true);
		});

		it("should return false if conversation does not exist", async () => {
			sinon.stub(Conversation, "findByPk").returns(null);
			const result = await conversationService.deleteConversation(1);

			expect(result).to.equal(false);
		});
	});

	describe("addUserToConversation", () => {
		it("should return false if no user provided", async () => {
			const result = await conversationService.addUserToConversation(null, 1);
			expect(result).to.equal(false);
		});

		it("should return false if conversation does not exist", async () => {
			sinon.stub(Conversation, "findByPk").returns(null);
			const result = await conversationService.addUserToConversation(mockUser, 1);
			expect(result).to.equal(false);
		});

		it("should return false if conversation is not group", async () => {
			sinon
				.stub(Conversation, "findByPk")
				.returns({ ...mockConversation, isGroup: false });
			const result = await conversationService.addUserToConversation(mockUser, 1);
			expect(result).to.equal(false);
		});

		it("should return false if user is already in conversation", async () => {
			sinon
				.stub(Conversation, "findByPk")
				.returns({ ...mockConversation, addUser: () => true });
			sinon.stub(User, "findByPk").returns(mockUser);
			sinon.stub(UserConversation, "findOne").returns({ id: 1 });

			const result = await conversationService.addUserToConversation(mockUser, 1);
			expect(result).to.equal(false);
		});

		it("should return user dto if user is added to conversation", async () => {
			sinon
				.stub(Conversation, "findByPk")
				.returns({ ...mockConversation, addUser: () => true });
			sinon.stub(User, "findByPk").returns(null); // for isUserInConversation to be false
			const result = await conversationService.addUserToConversation(
				{ dataValues: mockUser },
				1
			);
			expect(result).to.eql(new UserDTO(mockUser));
		});
	});

	describe("removeUserFromConversation", () => {
		it("should return false if user does not exist", async () => {
			sinon.stub(User, "findByPk").returns(null);
			sinon.stub(Conversation, "findByPk").returns({ isGroup: true });
			const result = await conversationService.removeUserFromConversation(1, 1);
			expect(result).to.equal(false);
		});

		it("should return false if conversation does not exist", async () => {
			sinon.stub(User, "findByPk").returns(mockUser);
			sinon.stub(Conversation, "findByPk").returns(null);

			const result = await conversationService.removeUserFromConversation(1, 1);
			expect(result).to.equal(false);
		});

		it("should return false if conversation is not group", async () => {
			sinon.stub(User, "findByPk").returns(mockUser);
			sinon.stub(Conversation, "findByPk").returns({ isGroup: false });

			const result = await conversationService.removeUserFromConversation(1, 1);
			expect(result).to.equal(false);
		});

		it("should return false if no row was deleted", async () => {
			sinon.stub(User, "findByPk").returns(mockUser);
			sinon.stub(Conversation, "findByPk").returns({ isGroup: true });
			const destroyStub = sinon.stub(UserConversation, "destroy").returns(0);

			const result = await conversationService.removeUserFromConversation(1, 1);
			expect(destroyStub.calledOnce).to.be.true;
			expect(result).to.equal(false);
		});
		it("should return true if a row was deleted", async () => {
			sinon.stub(User, "findByPk").returns(mockUser);
			sinon.stub(Conversation, "findByPk").returns({ isGroup: true });
			const destroyStub = sinon.stub(UserConversation, "destroy").returns(1);

			const result = await conversationService.removeUserFromConversation(1, 1);
			expect(destroyStub.calledOnce).to.be.true;
			expect(result).to.equal(true);
		});
	});

	describe("isUserInConversation", () => {
		it("should return true if user is in conversation", async () => {
			sinon.stub(User, "findByPk").returns(mockUser);
			sinon.stub(Conversation, "findByPk").returns(mockConversation);
			const findOneStub = sinon
				.stub(UserConversation, "findOne")
				.returns({ id: 1 });
			const result = await conversationService.isUserInConversation(1, 1);
			expect(findOneStub.calledOnce).to.be.true;
			expect(result).to.equal(true);
		});
		it("should return false if user is not in conversation", async () => {
			sinon.stub(User, "findByPk").returns(mockUser);
			sinon.stub(Conversation, "findByPk").returns(mockConversation);
			const findOneStub = sinon.stub(UserConversation, "findOne").returns(null);
			const result = await conversationService.isUserInConversation(1, 1);
			expect(findOneStub.calledOnce).to.be.true;
			expect(result).to.equal(false);
		});
		it("should return false if user does not exist", async () => {
			sinon.stub(User, "findByPk").returns(null);
			const result = await conversationService.isUserInConversation(1, 1);
			const findOneStub = sinon.stub(UserConversation, "findOne").returns(null);
			expect(findOneStub.called).to.be.false;
			expect(result).to.equal(false);
		});
		it("should return false if conversatoin does not exist", async () => {
			sinon.stub(User, "findByPk").returns(mockUser);
			sinon.stub(Conversation, "findByPk").returns(null);
			const result = await conversationService.isUserInConversation(1, 1);
			const findOneStub = sinon.stub(UserConversation, "findOne").returns(null);
			expect(findOneStub.called).to.be.false;
			expect(result).to.equal(false);
		});
	});
	describe("getConversationUsers", () => {
		it("should return [] if conversation does not exist", async () => {
			sinon.stub(Conversation, "findByPk").returns(null);
			const result = await conversationService.getConversationUsers(1);
			expect(result).to.eql([]);
		});
		it("should return the users if conversation exists", async () => {
			const users = [
				{ ...mockUser, id: 1 },
				{ ...mockUser, id: 2 },
				{ ...mockUser, id: 3 },
			];
			const conversation = {
				dataValues: {
					...mockConversation,
					Users: users.map((u) => ({ dataValues: u })),
				},
			};
			sinon.stub(Conversation, "findByPk").returns(conversation);

			const result = await conversationService.getConversationUsers(1);
			expect(result).to.eql(users.map((u) => new UserDTO(u)));
		});
	});
});
