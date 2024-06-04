const Joi = require("joi");

const updateMessageSchema = Joi.object({
	text: Joi.string().trim().min(1).max(255),
});

exports.validateUpdateMessage = (req, res, next) => {
	let json;

	try {
		json = JSON.parse(req.body.json);
	} catch (err) {
		return res.status(400).json({ error: "Invalid JSON data" });
	}
	const { error, value } = updateMessageSchema.validate(json);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};
