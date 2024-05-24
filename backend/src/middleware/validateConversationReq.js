const Joi = require("joi");

const createConversationSchema = Joi.object({
	name: Joi.string().trim().min(1).required(),
});

const updateConversationSchema = Joi.object({
	name: Joi.string().trim().min(1).required(),
});

const addUserToConversationSchema = Joi.object({
	email: Joi.alternatives().conditional("userId", {
		is: Joi.exist(),
		then: Joi.forbidden(),
		otherwise: Joi.string().email().required(),
	}),
	userId: Joi.alternatives().conditional("email", {
		is: Joi.exist(),
		then: Joi.forbidden(),
		otherwise: Joi.number().integer().positive().required(),
	}),
});

const createMessageSchema = Joi.object({
	text: Joi.string().trim().min(1).required(),
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
