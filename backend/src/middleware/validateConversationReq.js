const Joi = require("joi");

const createConversationSchema = Joi.object({
	isGroup: Joi.boolean().required(),
	name: Joi.string().when("isGroup", {
		is: true,
		then: Joi.required(),
		otherwise: Joi.optional(),
	}),
});

const updateConversationSchema = Joi.object({
	name: Joi.string().required(),
});

const addUserToConversationSchema = Joi.object({
	userId: Joi.number().integer().positive().required(),
});

const createMessageSchema = Joi.object({
	text: Joi.string().required(),
	senderId: Joi.number().integer().positive().required(),
});

exports.validateCreateConversation = (req, res, next) => {
	const { error, value } = createConversationSchema.validate(req.body);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};

exports.validateUpdateConversation = (req, res, next) => {
	const { error, value } = updateConversationSchema.validate(req.body);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};

exports.validateAddUserToConversation = (req, res, next) => {
	const { error, value } = addUserToConversationSchema.validate(req.body);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};

exports.validateCreateMessage = (req, res, next) => {
	const { error, value } = createMessageSchema.validate(req.body);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};
