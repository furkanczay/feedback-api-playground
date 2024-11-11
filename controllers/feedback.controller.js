const FeedbackService = require("../services/feedback.service");
const jwt = require("jsonwebtoken");
const feedbackService = new FeedbackService();

async function getAllFeedbacks(req, res) {
	const feedbacks = await feedbackService.findAll({
		include: {
			category: true,
			user: { select: { id: true, name: true, email: true } },
		},
	});
	res.status(200).json(feedbacks);
}

async function getFeedback(req, res) {
	const slug = req.params.slug;
	const feedback = await feedbackService.findBySlug(slug);
	if (!feedback) {
		return res.status(404).json({ message: "Feedback not found" });
	}
	res.status(200).json(feedback);
}

async function updateFeedback(req, res) {
	const slug = req.params.slug;
	const feedback = await feedbackService.findBySlug(slug);
	if (!feedback) {
		return res.status(404).json({ message: "Feedback not found" });
	}

	const { title, description, category } = req.body;
	const updatedFeedback = await feedbackService.update(feedback.id, {
		title,
		description,
		category,
	});
	res.status(200).json(updatedFeedback);
}

async function deleteFeedback(req, res) {
	const slug = req.params.slug;
	const feedback = await feedbackService.findBySlug(slug);
	if (!feedback) {
		return res.status(404).json({ message: "Feedback not found" });
	}
	await feedbackService.delete(feedback.id);
	res.status(200).json({ message: "Feedback deleted" });
}

async function getFeedbackComments(req, res) {
	const slug = req.params.slug;
	const feedback = await feedbackService.findBySlug(slug);
	if (!feedback) {
		return res.status(404).json({ message: "Feedback not found" });
	}
	const comments = await feedbackService.getComments(feedback.id);
	res.status(200).json(comments);
}

async function createFeedback(req, res) {
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
	const slug = req.body.title.toLowerCase().split(" ").join("-");
	const existSlug = await feedbackService.findBySlug(slug);
	if (existSlug) {
		return res.status(400).json({ message: "Slug already exists" });
	}
	const feedback = await feedbackService.create({
		...req.body,
		slug,
		user: {
			connect: {
				id: decoded.id,
			},
		},
		category: {
			connect: {
				id: parseInt(req.body.category),
			},
		},
	});
	res.status(201).json(feedback);
}

async function createComment(req, res) {
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

	const feedback = await feedbackService.findBySlug(req.params.slug);
	if (!feedback) {
		return res.status(404).json({ message: "Feedback not found" });
	}

	const { description } = req.body;

	const comment = await feedbackService.createComment(feedback.id, {
		description,
		user: {
			connect: {
				id: decoded.id,
			},
		},
	});
	res.status(201).json(comment);
}

async function deleteComment(req, res) {
	const id = req.params.id;
	const token = req.headers.authorization.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const comment = await feedbackService.getComment(id);
	if (!comment) {
		return res.status(404).json({ message: "Comment not found" });
	}
	if (comment.userId !== decoded.id) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const deletedComment = await feedbackService.deleteComment(id);
	if (!deletedComment) {
		return res.status(404).json({ message: "Comment not found" });
	}
	res.status(200).json({ message: "Comment deleted" });
}

module.exports = {
	getAllFeedbacks,
	createFeedback,
	updateFeedback,
	deleteFeedback,
	createComment,
	getFeedback,
	getFeedbackComments,
};
