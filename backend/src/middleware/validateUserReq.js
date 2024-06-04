const Joi = require("joi");

const updateUserSchema = Joi.object({
	name: Joi.string().trim().min(3).max(30),
	language: Joi.string().trim().min(2).max(2),
});

const sendDMSchema = Joi.object({
	text: Joi.string().trim().min(1).required(),
});

exports.validateUpdateUser = async (req, res, next) => {
	let json;

	try {
		json = JSON.parse(req.body.json);
	} catch (err) {
		return res.status(400).json({ error: "Invalid JSON data" });
	}
	const { error, value } = updateUserSchema.validate(json);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};

exports.validateSendDM = (req, res, next) => {
	const { error, value } = sendDMSchema.validate(req.body);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};
