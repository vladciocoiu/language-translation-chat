const Joi = require("joi");

const updateMessageSchema = Joi.object({
	text: Joi.string().trim().min(1).required(),
});

exports.validateUpdateMessage = (req, res, next) => {
	const { error, value } = updateMessageSchema.validate(req.body);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};
