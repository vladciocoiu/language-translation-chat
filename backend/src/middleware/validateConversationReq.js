const Joi = require("joi");

const createConversationSchema = Joi.object({
	name: Joi.string().trim().min(1).max(50).required(),
});

const updateConversationSchema = Joi.object({
	name: Joi.string().trim().min(1).max(50).required(),
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
	text: Joi.string().trim().min(1).max(255),
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
	let json;

	try {
		json = JSON.parse(req.body.json);
	} catch (err) {
		return res.status(400).json({ error: "Invalid JSON data" });
	}
	const { error, value } = createMessageSchema.validate(json);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};
