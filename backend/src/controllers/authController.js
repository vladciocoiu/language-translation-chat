const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = async (userId) =>
	await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "2h" });

exports.register = async (req, res) => {
	// get info from req body
	const { name, email, password } = req.body;

	// hash password
	const hash = await bcrypt.hash(password, 10);

	// create new user

	// save new user and send id as json
	try {
	} catch (err) {
		res.status(400).json({ error: err });
	}
};

exports.login = async (req, res) => {
	// get info from req body
	const { email, password } = req.body;

	// check if user exists in db
	const user = {};
	if (!user) return res.status(400).json({ error: "Invalid email." });

	// compare password
	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword)
		return res.status(400).json({ error: "Invalid password." });

	// generate signed access token
	const accessToken = await generateAccessToken(user._id);

	// add token to response header
	res.header("authentication", "Bearer " + accessToken);

	res.json({ accessToken, userIsAdmin: user.isAdmin });
};
