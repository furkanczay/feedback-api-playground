const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");

const userService = new UserService();

async function login(req, res) {
	const { email, password } = req.body;
	const user = await userService.findByUnique({ email: email });
	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}
	const isPasswordMatch = await bcrypt.compare(password, user.password);
	if (!isPasswordMatch) {
		return res.status(400).json({ message: "Invalid credentials" });
	}
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});
	res.json({ token });
}

async function register(req, res) {
	const { email, password, name } = req.body;
	const user = await userService.findByUnique({ email: email });
	if (user) {
		return res.status(400).json({ message: "User already exists" });
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = await userService.create({
		email,
		password: hashedPassword,
		name,
	});
	res.status(201).json(newUser);
}

module.exports = {
	login,
	register,
};
