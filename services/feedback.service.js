const { prisma } = require("../prisma/client");
const BaseService = require("./base.service");

class FeedbackService extends BaseService {
	constructor() {
		super(prisma.feedback);
	}

	async findBySlug(slug) {
		return await this.model.findUnique({
			where: { slug: slug },
		});
	}

	async getComments(id) {
		return await prisma.comment.findMany({
			where: {
				feedbackId: id,
			},
		});
	}

	async createComment(feedbackId, data) {
		return await prisma.comment.create({
			data: {
				...data,
				feedback: {
					connect: {
						id: feedbackId,
					},
				},
			},
		});
	}

	async deleteComment(id) {
		return await prisma.comment.delete({
			where: { id: id },
		});
	}
}

module.exports = FeedbackService;
