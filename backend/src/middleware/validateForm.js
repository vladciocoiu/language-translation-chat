const Joi = require("joi");

// validation schema for register form
const registerSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().min(3).required().email(),
	password: Joi.string().min(6).required(),
	confirmPassword: Joi.valid(Joi.ref("password")).messages({
		"any.only": "The 2 passwords do not match.",
	}),
});

// validation schema for login form
const loginSchema = Joi.object({
	email: Joi.string().min(3).required().email(),
	password: Joi.string().min(6).required(),
});

// validation middleware function for login
exports.validateLogin = (req, res, next) => {
	const { error } = loginSchema.validate(req.body);

	if (error) return res.status(400).json({ error: error.details[0].message });

	next();
};

// validation middleware function for register
exports.validateRegister = (req, res, next) => {
	const { error } = registerSchema.validate(req.body);

	if (error) return res.status(400).json({ error: error.details[0].message });

	next();
};
