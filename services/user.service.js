const { prisma } = require("../prisma/client");
const BaseService = require("./base.service");

class UserService extends BaseService {
	constructor() {
		super(prisma.user);
	}
	async findByEmail(email) {
		return await this.model.findUnique({
			where: { email: email },
		});
	}
}

module.exports = UserService;
