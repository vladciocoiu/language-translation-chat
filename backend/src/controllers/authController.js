const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { getUserByEmail, createUser } = require("../services/userService");

const generateAccessToken = async (userId) =>
	await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "2h" });

exports.register = async (req, res) => {
	// get info from req body
	const { name, email, password } = req.body;

	// hash password
	const hash = await bcrypt.hash(password, 10);

	// create new user object
	const newUser = {
		name,
		email,
		password: hash,
	};

	// save new user and send id as json
	let user;
	try {
		user = await createUser(newUser);
	} catch (err) {
		return res.status(400).json({ error: err });
	}

	res.json({ id: user.id });
};

exports.login = async (req, res) => {
	// get info from req body
	const { email, password } = req.body;

	// check if user exists in db
	let user;
	try {
		user = await getUserByEmail(email);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
	if (!user) return res.status(400).json({ error: "Invalid credentials." });

	// compare password
	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword)
		return res.status(400).json({ error: "Invalid credentials." });

	// generate signed access token
	const accessToken = await generateAccessToken(user.id);

	// add token to response header
	res.header("authentication", "Bearer " + accessToken);

	res.json({ accessToken });
};
