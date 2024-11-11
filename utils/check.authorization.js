const jwt = require("jsonwebtoken");

function checkAuthorization(req, res, next) {
	const authorization = req.headers.authorization;
	if (!authorization) return res.status(401).json({ message: "Unauthorized" });

	const token = authorization.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	if (!decoded) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	next();
}

module.exports = checkAuthorization;
