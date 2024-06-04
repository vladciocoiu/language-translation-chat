const { expect } = require("chai");
const sinon = require("sinon");
const messageService = require("../../src/services/messageService");
const Message = require("../../src/models/message");
const MessageDTO = require("../../src/dtos/messageDTO");
const User = require("../../src/models/user");
const Conversation = require("../../src/models/conversation");
const Translation = require("../../src/models/translation");
const TranslationDTO = require("../../src/dtos/translationDTO");
const axios = require("axios");

describe("Message Service", () => {
	beforeEach(() => {
		sinon.stub(Message, "sync").returns(true);
		sinon.stub(User, "sync").returns(true);
		sinon.stub(Conversation, "sync").returns(true);
		sinon.stub(Translation, "sync").returns(true);
	});
	afterEach(() => {
		sinon.restore();
	});

	const mockMessage = {
		id: 1,
		text: "test",
		senderId: 1,
		conversationId: 1,
	};
	const mockUser = {
		id: 1,
		email: "john@doe.com",
		name: "John Doe",
		language: "en",
	};
	const mockMessageList = [
		{ ...mockMessage, id: 1 },
		{ ...mockMessage, id: 2 },
		{ ...mockMessage, id: 3 },
	];
	const translationMock = {
		messageId: 1,
		translatedText: "test",
		originalLanguage: "en",
		targetLanguage: "ro",
	};

	describe("createMessage", () => {
		beforeEach(() => {
			sinon.stub(Message, "create").withArgs(mockMessage).returns(mockMessage);
		});
		it("should create a message if everything is ok", async () => {
			sinon
				.stub(User, "findByPk")
				.withArgs(mockMessage.senderId)
				.returns({ dataValues: mockUser });

			sinon
				.stub(Conversation, "findByPk")
				.withArgs(mockMessage.conversationId)
				.returns({ dataValues: { id: 1 }, hasUser: (user) => true });

			const message = await messageService.createMessage(mockMessage);
			expect(message).to.equal(mockMessage);
		});

		it("should return false if text is missing", async () => {
			const message = await messageService.createMessage({
				...mockMessage,
				text: null,
			});
			expect(message).to.equal(false);
		});
		it("should return false if senderId is missing", async () => {
			const message = await messageService.createMessage({
				...mockMessage,
				senderId: null,
			});
			expect(message).to.equal(false);
		});
		it("should return false if conversationId is missing", async () => {
			const message = await messageService.createMessage({
				...mockMessage,
				conversationId: null,
			});
			expect(message).to.equal(false);
		});
		it("should return false if user does not exist", async () => {
			sinon.stub(User, "findByPk").withArgs(mockMessage.senderId).returns(null);
			const message = await messageService.createMessage(mockMessage);
			expect(message).to.equal(false);
		});
		it("should return false if conversation does not exist", async () => {
			sinon
				.stub(User, "findByPk")
				.withArgs(mockMessage.senderId)
				.returns({ dataValues: mockUser });
			sinon
				.stub(Conversation, "findByPk")
				.withArgs(mockMessage.conversationId)
				.returns(null);
			const message = await messageService.createMessage(mockMessage);
			expect(message).to.equal(false);
		});
		it("should return false if user is not in conversation", async () => {
			sinon
				.stub(User, "findByPk")
				.withArgs(mockMessage.senderId)
				.returns({ dataValues: mockUser });
			sinon
				.stub(Conversation, "findByPk")
				.withArgs(mockMessage.conversationId)
				.returns({ dataValues: { id: 1 }, hasUser: (user) => false });
			const message = await messageService.createMessage(mockMessage);
			expect(message).to.equal(false);
		});
	});

	describe("deleteMessage", () => {
		it("should return true and call message.destroy if message exists", async () => {
			const destroyFunction = () => true;
			const destroySpy = sinon.spy(destroyFunction);

			sinon
				.stub(Message, "findByPk")
				.withArgs(1)
				.returns({ ...mockMessage, destroy: destroySpy });

			const message = await messageService.deleteMessage(1);
			expect(message).to.equal(true);
			expect(destroySpy.calledOnce).to.be.true;
		});
		it("should return false if message does not exist", async () => {
			sinon.stub(Message, "findByPk").withArgs(1).returns(null);
			const message = await messageService.deleteMessage(1);
			expect(message).to.equal(false);
		});
	});

	describe("updateMessage", () => {
		it("should return true and call message.update if message exists", async () => {
			const updateFunction = () => true;
			const updateSpy = sinon.spy(updateFunction);

			sinon
				.stub(Message, "findByPk")
				.withArgs(1)
				.returns({ ...mockMessage, update: updateSpy });

			const message = await messageService.updateMessage(1);
			expect(message).to.equal(true);
			expect(updateSpy.calledOnce).to.be.true;
		});
		it("should return false if message does not exist", async () => {
			sinon.stub(Message, "findByPk").withArgs(1).returns(null);
			const message = await messageService.updateMessage(1, mockMessage);
			expect(message).to.equal(false);
		});
	});

	describe("getMessagesByConversationId", () => {
		it("should return messages if conversation exists", async () => {
			sinon
				.stub(Conversation, "findByPk")
				.withArgs(1)
				.returns({ dataValues: { id: 1 } });
			sinon.stub(Message, "findAll").returns(
				mockMessageList.map((m) => ({
					dataValues: { ...m, User: mockUser },
				}))
			);
			const messages = await messageService.getMessagesByConversationId(1, 0, 10);
			expect(messages).to.eql(
				mockMessageList.map((m) => new MessageDTO({ ...m, User: mockUser }))
			);
		});
		it("should return false if conversation does not exist", async () => {
			sinon.stub(Conversation, "findByPk").withArgs(1).returns(null);
			const messages = await messageService.getMessagesByConversationId(1, 0, 10);
			expect(messages).to.equal(false);
		});
	});

	describe("isUserSenderOfMessage", () => {
		it("should return true if user is the sender of the message", async () => {
			sinon
				.stub(Message, "findByPk")
				.withArgs(mockMessage.senderId)
				.returns(mockMessage);
			const isSender = await messageService.isUserSenderOfMessage(
				mockMessage.senderId,
				mockMessage.id
			);
			expect(isSender).to.equal(true);
		});
		it("should return false if user is not the sender of the message", async () => {
			sinon.stub(Message, "findByPk").withArgs(4).returns(mockMessage);
			const isSender = await messageService.isUserSenderOfMessage(
				4,
				mockMessage.id
			);
			expect(isSender).to.equal(false);
		});
		it("should return false if message does not exist", async () => {
			sinon.stub(Message, "findByPk").withArgs(4).returns(null);
			const isSender = await messageService.isUserSenderOfMessage(1, 4);
			expect(isSender).to.equal(false);
		});
	});
	describe("sendDirectMessage", () => {
		beforeEach(() => {
			sinon.stub(User, "findByPk").returns({ dataValues: mockUser });
		});
		it("should return false if senderId is equal to receiverId", async () => {
			const message = await messageService.sendDirectMessage(1, 1, "test");
			expect(message).to.equal(false);
		});
		it("should call Conversation.create if conversation does not exist", async () => {
			sinon.stub(Conversation, "findOne").returns(null);
			sinon.stub(messageService, "createMessage").returns(mockMessage);
			sinon.stub(Message, "findByPk").returns({
				dataValues: { ...mockMessage, User: mockUser },
			});
			const createStub = sinon
				.stub(Conversation, "create")
				.returns({ id: 1, addUser: () => true });
			const message = await messageService.sendDirectMessage(1, 2, "test");

			expect(createStub.calledOnce).to.be.true;
			expect(message).to.eql(new MessageDTO({ ...mockMessage, User: mockUser }));
		});
		it("should not call Conversation.create if conversation exists", async () => {
			sinon.stub(Conversation, "findOne").returns({ id: 1, hasUser: () => true });

			const createStub = sinon.stub(Conversation, "create");
			sinon.stub(messageService, "createMessage").returns(mockMessage);
			sinon.stub(Message, "findByPk").returns({
				dataValues: { ...mockMessage, User: mockUser },
			});
			sinon.stub(Message, "create").returns(mockMessage);
			const message = await messageService.sendDirectMessage(1, 2, "test");

			expect(createStub.called).to.be.false;
			expect(message).to.eql(new MessageDTO({ ...mockMessage, User: mockUser }));
		});
	});

	describe("createMessageInConversation", () => {
		beforeEach(() => {
			sinon.stub(User, "findByPk").returns({ dataValues: mockUser });
			sinon
				.stub(Conversation, "findByPk")
				.returns({ dataValues: { id: 1 }, hasUser: () => true });
		});
		it("should return false if message creation fails", async () => {
			sinon.stub(Message, "create").returns(false);

			const message = await messageService.createMessageInConversation(
				mockMessage
			);
			expect(message).to.equal(false);
		});
		it("should return message dto if message creation is successful", async () => {
			sinon.stub(Message, "create").returns({ id: 1 });

			sinon.stub(Message, "findByPk").returns({
				dataValues: { ...mockMessage, User: mockUser },
			});
			const message = await messageService.createMessageInConversation(
				mockMessage
			);
			expect(message).to.eql(new MessageDTO({ ...mockMessage, User: mockUser }));
		});
	});

	describe("getMessagesByReceiverId", () => {
		beforeEach(() => {
			sinon.stub(Conversation, "findByPk").returns({ id: 1 });
		});
		it("should return messages if conversation exists", async () => {
			sinon.stub(Conversation, "findOne").returns({ id: 1 });

			sinon.stub(Message, "findAll").returns(
				mockMessageList.map((m) => ({
					dataValues: { ...m, User: mockUser },
				}))
			);
			const messages = await messageService.getMessagesByReceiverId(1, 2, 0, 10);
			expect(messages).to.eql(
				mockMessageList.map((m) => new MessageDTO({ ...m, User: mockUser }))
			);
		});
		it("should return [] if conversation does not exist", async () => {
			sinon.stub(Conversation, "findOne").returns(null);
			const messages = await messageService.getMessagesByReceiverId(1, 2, 0, 10);
			expect(messages).to.eql([]);
		});
		it("should return [] if messages do not exist", async () => {
			sinon.stub(Conversation, "findOne").returns({ id: 1 });

			sinon.stub(Message, "findAll").returns([]);
			const messages = await messageService.getMessagesByReceiverId(1, 2, 0, 10);
			expect(messages).to.eql([]);
		});
	});

	describe("getMessageLanguage", () => {
		it("should return the language of the message if translation exists", async () => {
			sinon.stub(Translation, "findOne").returns({ originalLanguage: "en" });
			const language = await messageService.getMessageLanguage(1);
			expect(language).to.equal("en");
		});
		it("should return false if translation does not exist", async () => {
			sinon.stub(Translation, "findOne").returns(null);
			const language = await messageService.getMessageLanguage(1);
			expect(language).to.equal(false);
		});
	});

	describe("detectMessageLanguage", () => {
		it("should return the language of the message if translation exists", async () => {
			sinon.stub(Translation, "findOne").returns({ originalLanguage: "en" });
			const language = await messageService.detectMessageLanguage(1);
			expect(language).to.equal("en");
		});
		it("should return false if message does not exist", async () => {
			sinon.stub(Translation, "findOne").returns(null);
			sinon.stub(Message, "findByPk").returns(null);
			const language = await messageService.detectMessageLanguage(2);
			expect(language).to.equal(false);
		});
	});

	describe("getTranslatedMessage", () => {
		it("should return false if message doesn't exist", async () => {
			sinon.stub(Message, "findByPk").returns(null);
			const message = await messageService.getTranslatedMessage(1, "en", "ro");
			expect(message).to.equal(false);
		});

		it("should return the same text if the message is already in the requested language", async () => {
			sinon.stub(Message, "findByPk").returns({ text: "test" });
			const message = await messageService.getTranslatedMessage(1, "en", "en");
			expect(message).to.eql({
				translatedText: "test",
				originalLanguage: "en",
				targetLanguage: "en",
			});
		});

		it("should return the translated message if translation exists", async () => {
			sinon.stub(Message, "findByPk").returns({ text: "test" });
			sinon.stub(Translation, "findOne").returns({ dataValues: translationMock });
			const message = await messageService.getTranslatedMessage(1, "en", "ro");
			expect(message).to.eql(translationMock);
		});
		it("should return a falsey value if translation does not exist", async () => {
			sinon.stub(Message, "findByPk").returns({ dataValues: { text: "test" } });
			sinon.stub(Translation, "findOne").returns(null);
			const message = await messageService.getTranslatedMessage(1, "en", "ro");
			expect(!!message).to.equal(false);
		});
	});
	describe("translateMessage", () => {
		it("should return the translated message if translation exists", async () => {
			sinon.stub(Message, "findByPk").returns({ text: "test" });
			sinon.stub(Translation, "findOne").returns({ dataValues: translationMock });
			const message = await messageService.translateMessage(1, "ro", "en");
			expect(message).to.eql(new TranslationDTO(translationMock));
		});
		it("should return false if message does not have text", async () => {
			sinon.stub(Message, "findByPk").returns({ text: null });
			const message = await messageService.translateMessage(1, "ro", "en");
			expect(message).to.equal(false);
		});
		it("should call axios.get, Translation.create, and return translation if translation does not exist", async () => {
			sinon.stub(Translation, "findOne").returns(null);
			sinon.stub(Message, "findByPk").returns({ text: "test" });

			const axiosStub = sinon
				.stub(axios, "get")
				.returns({ data: { responseData: { translatedText: "ceva" } } });
			const translationCreateStub = sinon
				.stub(Translation, "create")
				.returns({ dataValues: translationMock });
			const message = await messageService.translateMessage(1, "ro", "en");
			expect(axiosStub.calledOnce).to.be.true;
			expect(translationCreateStub.calledOnce).to.be.true;
			expect(message).to.eql(new TranslationDTO(translationMock));
		});
	});
});
