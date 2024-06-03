const { expect } = require("chai");
const sinon = require("sinon");
const authService = require("../../src/services/authService");
const Message = require("../../src/models/message");
const User = require("../../src/models/user");
const Conversation = require("../../src/models/conversation");
const Translation = require("../../src/models/translation");
const UserConversation = require("../../src/models/userConversation");
const bcrypt = require("bcryptjs");
const RefreshToken = require("../../src/models/refreshToken");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

describe("Auth Service", () => {
	let hashStub, sendMailStub;
	beforeEach(() => {
		sinon.stub(Message, "sync").returns(true);
		sinon.stub(User, "sync").returns(true);
		sinon.stub(Conversation, "sync").returns(true);
		sinon.stub(Translation, "sync").returns(true);
		sinon.stub(UserConversation, "sync").returns(true);
		sinon.stub(RefreshToken, "sync").returns(true);

		hashStub = sinon.stub(bcrypt, "hash").returns("hashedPassword");
		sinon.stub(bcrypt, "compare").callsFake((pass) => pass === "password");
		sinon.stub(jwt, "sign").returns("token");
		sendMailStub = sinon.stub().returns(true);
		sinon.stub(nodemailer, "createTransport").returns({
			sendMail: sendMailStub,
		});
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

	describe("register", () => {
		it("should return false if user already exists", async () => {
			sinon
				.stub(User, "findOne")
				.withArgs({ where: { email: mockUser.email } })
				.returns(mockUser);

			const user = await authService.register(
				mockUser.name,
				mockUser.email,
				"password"
			);

			expect(user).to.be.false;
		});

		it("should return user data when user is created", async () => {
			sinon
				.stub(User, "findOne")
				.withArgs({ where: { email: mockUser.email } })
				.returns(null);
			const createStub = sinon.stub(User, "create").returns(mockUser);

			const user = await authService.register(
				mockUser.name,
				mockUser.email,
				"password"
			);

			expect(hashStub.calledWith("password")).to.be.true;
			expect(createStub.calledOnce).to.be.true;
			expect(user).to.equal(mockUser);
		});
	});

	describe("login", () => {
		it("should return false if user does not exist", async () => {
			sinon
				.stub(User, "findOne")
				.withArgs({ where: { email: mockUser.email } })
				.returns(null);

			const user = await authService.login(mockUser.email, "password");

			expect(user).to.be.false;
		});

		it("should return false if user is not verified", async () => {
			sinon
				.stub(User, "findOne")
				.withArgs({ where: { email: mockUser.email } })
				.returns({ ...mockUser, isVerified: false });

			const user = await authService.login(mockUser.email, "password");

			expect(user).to.be.false;
		});

		it("should return false if password is incorrect", async () => {
			sinon
				.stub(User, "findOne")
				.withArgs({ where: { email: mockUser.email } })
				.returns({ ...mockUser, isVerified: true });

			const user = await authService.login(mockUser.email, "incorrectPassword");

			expect(user).to.be.false;
		});

		it("should return user data and tokens if login is successful", async () => {
			sinon
				.stub(User, "findOne")
				.withArgs({ where: { email: mockUser.email } })
				.returns({ ...mockUser, isVerified: true });
			sinon.stub(RefreshToken, "create").returns(true);

			const user = await authService.login(mockUser.email, "password");

			expect(user).to.eql({
				accessToken: "token",
				refreshToken: "token",
				userId: mockUser.id,
				email: mockUser.email,
				language: mockUser.language,
			});
		});
	});

	describe("verify", () => {
		it("should return false if user does not exist", async () => {
			sinon.stub(User, "findOne").returns(null);
			const success = await authService.verify("token");
			expect(success).to.be.false;
		});
		it("should return true if user is verified", async () => {
			const updateStub = sinon.stub().returns(true);
			sinon.stub(User, "findOne").returns({ update: updateStub });
			const success = await authService.verify("token");
			expect(success).to.be.true;
		});
	});

	describe("forgotPassword", () => {
		it("should return false if user does not exist", async () => {
			sinon.stub(User, "findOne").returns(null);
			const success = await authService.forgotPassword("email");
			expect(success).to.be.false;
		});
		it("should return true if data is good", async () => {
			const updateStub = sinon.stub().returns(true);
			sinon.stub(User, "findOne").returns({ ...mockUser, update: updateStub });
			const success = await authService.forgotPassword("email");
			expect(sendMailStub.calledOnce).to.be.true;
			expect(success).to.be.true;
		});
	});

	describe("resetPassword", () => {
		it("should return false if user does not exist", async () => {
			sinon.stub(User, "findOne").returns(null);
			const success = await authService.resetPassword("token", "password");
			expect(success).to.be.false;
		});
		it("should return false if token is expired", async () => {
			sinon
				.stub(User, "findOne")
				.returns({ ...mockUser, passwordResetTokenExpiry: Date.now() - 1 });
			const success = await authService.resetPassword("token", "password");
			expect(success).to.be.false;
		});
		it("should return true if data is good", async () => {
			const updateStub = sinon.stub().returns(true);
			sinon.stub(User, "findOne").returns({
				...mockUser,
				passwordResetTokenExpiry: Date.now() + 1000000,
				update: updateStub,
			});
			const success = await authService.resetPassword("token", "password");
			expect(hashStub.calledWith("password")).to.be.true;
			expect(updateStub.calledOnce).to.be.true;
			expect(success).to.be.true;
		});
	});

	describe("logout", () => {
		it("should return false if token is not found", async () => {
			sinon.stub(RefreshToken, "findOne").returns(null);
			const success = await authService.logout("token");
			expect(success).to.be.false;
		});
		it("should return true if token is good", async () => {
			const destroyStub = sinon.stub().returns(true);
			sinon.stub(RefreshToken, "findOne").returns({ destroy: destroyStub });
			const success = await authService.logout("token");
			expect(destroyStub.calledOnce).to.be.true;
			expect(success).to.be.true;
		});
	});

	describe("refresh", () => {
		it("should return false if token is not found", async () => {
			sinon.stub(RefreshToken, "findOne").returns(null);
			const success = await authService.refresh("token");
			expect(success).to.be.false;
		});
		it("should return false if token is invalid", async () => {
			sinon.stub(RefreshToken, "findOne").returns({ hash: "hashedToken" });

			const verifyStub = sinon
				.stub(jwt, "verify")
				.throws(new Error("Invalid token"));
			const success = await authService.refresh("token");
			expect(verifyStub.calledOnce).to.be.true;
			expect(success).to.be.false;
		});
		it("should return tokens if token is good", async () => {
			const updateStub = sinon.stub().returns(true);
			sinon
				.stub(RefreshToken, "findOne")
				.returns({ hash: "hashedToken", update: updateStub });
			sinon.stub(jwt, "verify").returns({ userId: 1 });

			const success = await authService.refresh("token");
			expect(updateStub.calledOnce).to.be.true;
			expect(success).to.eql({
				accessToken: "token",
				refreshToken: "token",
			});
		});
	});
});
