const Joi = require("joi");

const updateUserSchema = Joi.object({
	name: Joi.string().trim().min(3).required(),
});

exports.validateUpdateUser = (req, res, next) => {
	const { error, value } = updateUserSchema.validate(req.body);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};
