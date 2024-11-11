function checkToken(req, res, next) {
	const xToken = req.headers["x-feedback-token"];
	console.log(xToken);

	if (!xToken)
		return res.status(401).json({ message: "Bu apiyi kullanma izniniz yok.." });
	const tokens = process.env.ALLOWED_KEYS.split(",");
	const parsedTokens = tokens.map((token) => token.trim().replace(/"/g, ""));
	if (!parsedTokens.includes(xToken)) {
		return res.status(401).json({ message: "Bu apiyi kullanma izniniz yok.." });
	}

	next();
}

module.exports = checkToken;
