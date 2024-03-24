const Joi = require("joi");

// validation schema for register form
const registerSchema = Joi.object({
	name: Joi.string().trim().min(3).required(),
	email: Joi.string().min(3).required().email(),
	password: Joi.string().min(6).required(),
	confirmPassword: Joi.valid(Joi.ref("password"))
		.messages({
			"any.only": "The 2 passwords do not match.",
		})
		.required(),
});

// validation schema for login form
const loginSchema = Joi.object({
	email: Joi.string().min(3).required().email(),
	password: Joi.string().min(6).required(),
});

// validation middleware function for login
exports.validateLogin = (req, res, next) => {
	const { error, value } = loginSchema.validate(req.body);

	if (error) return res.status(400).json({ error: "Invalid credentials." });

	req.validatedPayload = value;
	next();
};

// validation middleware function for register
exports.validateRegister = (req, res, next) => {
	const { error, value } = registerSchema.validate(req.body);

	if (error)
		return res
			.status(400)
			.json({ error: "Invalid Request Payload: " + error.details[0].message });

	req.validatedPayload = value;
	next();
};
