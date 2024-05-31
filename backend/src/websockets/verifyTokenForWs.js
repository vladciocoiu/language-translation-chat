const jwt = require("jsonwebtoken");

const verifyTokenForWs = (token, ws, next) => {
	if (!token) throw new Error("Token missing");

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		ws.user = verified;
		next();
	} catch (err) {
		throw new Error("Invalid token");
	}
};

module.exports = { verifyTokenForWs };
